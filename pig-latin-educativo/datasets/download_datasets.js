const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Dataset sources with direct download URLs
const datasets = [
    {
        name: 'titanic.csv',
        url: 'https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv',
        description: 'Titanic passenger data for joins and filtering'
    },
    {
        name: 'iris.csv',
        url: 'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data',
        description: 'Iris flower dataset for grouping and basic operations'
    },
    {
        name: 'wine-quality-red.csv',
        url: 'https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv',
        description: 'Red wine quality dataset for aggregations'
    },
    {
        name: 'wine-quality-white.csv',
        url: 'https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-white.csv',
        description: 'White wine quality dataset for aggregations'
    }
];

// Synthetic datasets to be generated
const syntheticDatasets = [
    {
        name: 'users.csv',
        generator: () => {
            const lines = ['user_id,name,age,country,signup_date'];
            for (let i = 1; i <= 100; i++) {
                const countries = ['USA', 'UK', 'Canada', 'Spain', 'Mexico', 'Argentina'];
                const names = ['Alice', 'Bob', 'Carlos', 'Diana', 'Elena', 'Frank'];
                lines.push(`${i},${names[i % names.length]}${i},${20 + (i % 50)},${countries[i % countries.length]},2024-${String((i % 12) + 1).padStart(2, '0')}-01`);
            }
            return lines.join('\n');
        }
    },
    {
        name: 'orders.csv',
        generator: () => {
            const lines = ['order_id,user_id,product,quantity,price,order_date'];
            for (let i = 1; i <= 200; i++) {
                const products = ['Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse'];
                const userId = (i % 100) + 1;
                const quantity = (i % 5) + 1;
                const price = (Math.random() * 1000).toFixed(2);
                lines.push(`${i},${userId},${products[i % products.length]},${quantity},${price},2024-${String((i % 12) + 1).padStart(2, '0')}-15`);
            }
            return lines.join('\n');
        }
    },
    {
        name: 'products.csv',
        generator: () => {
            const products = [
                'Laptop,Electronics,999.99,Dell',
                'Phone,Electronics,699.99,Apple',
                'Tablet,Electronics,499.99,Samsung',
                'Monitor,Electronics,299.99,LG',
                'Keyboard,Accessories,79.99,Logitech',
                'Mouse,Accessories,49.99,Logitech'
            ];
            return 'product_name,category,price,brand\n' + products.join('\n');
        }
    },
    {
        name: 'server-logs.csv',
        generator: () => {
            const lines = ['timestamp,ip_address,request_path,status_code,response_time_ms'];
            const paths = ['/home', '/api/users', '/api/orders', '/login', '/dashboard'];
            const statuses = [200, 200, 200, 404, 500];
            for (let i = 1; i <= 500; i++) {
                const ip = `192.168.1.${(i % 255) + 1}`;
                const path = paths[i % paths.length];
                const status = statuses[i % statuses.length];
                const responseTime = Math.floor(Math.random() * 1000);
                lines.push(`2024-01-01T${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00,${ip},${path},${status},${responseTime}`);
            }
            return lines.join('\n');
        }
    },
    {
        name: 'movies.csv',
        generator: () => {
            const movies = [
                '1,The Shawshank Redemption,1994,Drama,9.3',
                '2,The Godfather,1972,Crime,9.2',
                '3,The Dark Knight,2008,Action,9.0',
                '4,Pulp Fiction,1994,Crime,8.9',
                '5,Forrest Gump,1994,Drama,8.8',
                '6,Inception,2010,Sci-Fi,8.8',
                '7,The Matrix,1999,Sci-Fi,8.7',
                '8,Goodfellas,1990,Crime,8.7',
                '9,Interstellar,2014,Sci-Fi,8.6',
                '10,The Lord of the Rings,2001,Fantasy,8.8'
            ];
            return 'movie_id,title,year,genre,rating\n' + movies.join('\n');
        }
    },
    {
        name: 'ratings.csv',
        generator: () => {
            const lines = ['user_id,movie_id,rating,timestamp'];
            for (let i = 1; i <= 300; i++) {
                const userId = (i % 50) + 1;
                const movieId = (i % 10) + 1;
                const rating = (Math.random() * 5).toFixed(1);
                const timestamp = `2024-01-${String((i % 28) + 1).padStart(2, '0')}T12:00:00`;
                lines.push(`${userId},${movieId},${rating},${timestamp}`);
            }
            return lines.join('\n');
        }
    },
    {
        name: 'employees.csv',
        generator: () => {
            const lines = ['emp_id,name,department,salary,hire_date,manager_id'];
            const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
            const names = ['John', 'Jane', 'Mike', 'Sarah', 'Tom', 'Lisa', 'David', 'Emma'];
            for (let i = 1; i <= 50; i++) {
                const managerId = i > 10 ? (i % 10) + 1 : '';
                const salary = 50000 + (i * 1000);
                lines.push(`${i},${names[i % names.length]} Smith,${departments[i % departments.length]},${salary},2020-${String((i % 12) + 1).padStart(2, '0')}-01,${managerId}`);
            }
            return lines.join('\n');
        }
    },
    {
        name: 'sales.csv',
        generator: () => {
            const lines = ['sale_id,region,product_category,amount,sale_date'];
            const regions = ['North', 'South', 'East', 'West'];
            const categories = ['Electronics', 'Clothing', 'Food', 'Books'];
            for (let i = 1; i <= 200; i++) {
                const amount = (Math.random() * 10000).toFixed(2);
                lines.push(`${i},${regions[i % regions.length]},${categories[i % categories.length]},${amount},2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`);
            }
            return lines.join('\n');
        }
    },
    {
        name: 'web-clicks.csv',
        generator: () => {
            const lines = ['session_id,user_id,page,action,timestamp'];
            const pages = ['home', 'product', 'cart', 'checkout', 'profile'];
            const actions = ['view', 'click', 'scroll', 'purchase'];
            for (let i = 1; i <= 1000; i++) {
                const sessionId = `sess_${Math.floor(i / 10)}`;
                const userId = (i % 100) + 1;
                lines.push(`${sessionId},${userId},${pages[i % pages.length]},${actions[i % actions.length]},2024-01-01T${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`);
            }
            return lines.join('\n');
        }
    },
    {
        name: 'sensors.csv',
        generator: () => {
            const lines = ['sensor_id,location,temperature,humidity,timestamp'];
            const locations = ['Room-A', 'Room-B', 'Room-C', 'Outdoor'];
            for (let i = 1; i <= 500; i++) {
                const sensorId = `S${(i % 10) + 1}`;
                const temp = (15 + Math.random() * 20).toFixed(1);
                const humidity = (30 + Math.random() * 50).toFixed(1);
                lines.push(`${sensorId},${locations[i % locations.length]},${temp},${humidity},2024-01-01T${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`);
            }
            return lines.join('\n');
        }
    }
];

async function downloadFile(dataset) {
    try {
        console.log(`Downloading ${dataset.name}...`);
        const response = await axios.get(dataset.url, {
            timeout: 30000,
            responseType: 'text'
        });

        const filePath = path.join(__dirname, dataset.name);
        await fs.writeFile(filePath, response.data);
        console.log(`✓ Downloaded ${dataset.name}`);
        return true;
    } catch (error) {
        console.error(`✗ Failed to download ${dataset.name}:`, error.message);
        return false;
    }
}

async function generateSyntheticDataset(dataset) {
    try {
        console.log(`Generating ${dataset.name}...`);
        const content = dataset.generator();
        const filePath = path.join(__dirname, dataset.name);
        await fs.writeFile(filePath, content);
        console.log(`✓ Generated ${dataset.name}`);
        return true;
    } catch (error) {
        console.error(`✗ Failed to generate ${dataset.name}:`, error.message);
        return false;
    }
}

async function createDatasetIndex() {
    const allDatasets = [
        ...datasets.map(d => ({ name: d.name, description: d.description, type: 'downloaded' })),
        ...syntheticDatasets.map(d => ({ name: d.name, description: 'Synthetic dataset', type: 'generated' }))
    ];

    const indexPath = path.join(__dirname, 'datasets-index.json');
    await fs.writeFile(indexPath, JSON.stringify(allDatasets, null, 2));
    console.log('✓ Created dataset index');
}

async function main() {
    console.log('=== Pig Latin Educational Platform - Dataset Setup ===\n');

    // Download external datasets
    console.log('Downloading external datasets...');
    for (const dataset of datasets) {
        await downloadFile(dataset);
        // Small delay to avoid overwhelming servers
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\nGenerating synthetic datasets...');
    for (const dataset of syntheticDatasets) {
        await generateSyntheticDataset(dataset);
    }

    console.log('\nCreating dataset index...');
    await createDatasetIndex();

    console.log('\n=== Setup Complete ===');
    console.log(`Total datasets: ${datasets.length + syntheticDatasets.length}`);
}

main().catch(console.error);
