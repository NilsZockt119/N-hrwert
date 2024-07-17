async function searchProduct() {
    const query = document.getElementById("product-search").value;
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${query}.json`);
    const data = await response.json();
    
    if (data.status === 1) {
        displayProductInfo(data.product);
    } else {
        document.getElementById("product-info").innerHTML = "<p>Produkt nicht gefunden.</p>";
        document.getElementById("nutritionChart").style.display = "none";
    }
}

function displayProductInfo(product) {
    const productInfo = document.getElementById("product-info");
    productInfo.innerHTML = `
        <div class="product-details">
            <img src="${product.image_url || ''}" alt="${product.product_name}">
            <h2>${product.product_name}</h2>
            <p><strong>Marke:</strong> ${product.brands || 'N/A'}</p>
            <p><strong>Kategorie:</strong> ${product.categories || 'N/A'}</p>
            <p><strong>Zutaten:</strong> ${product.ingredients_text || 'N/A'}</p>
            <div class="nutri-score">
                <p><strong>Nutri-Score:</strong></p>
                <img src="https://static.openfoodfacts.org/images/misc/nutriscore-${product.nutriscore_grade}.svg" alt="Nutri-Score ${product.nutriscore_grade}">
            </div>
            <h3>Nährwerte (pro 100g):</h3>
            <table class="nutrition-table">
                <tr>
                    <th>Nährwert</th>
                    <th>Menge</th>
                </tr>
                <tr>
                    <td>Kalorien</td>
                    <td>${product.nutriments['energy-kcal_100g'] || 'N/A'} kcal</td>
                </tr>
                <tr>
                    <td>Fett</td>
                    <td>${product.nutriments['fat_100g'] || 'N/A'} g</td>
                </tr>
                <tr>
                    <td>Gesättigte Fettsäuren</td>
                    <td>${product.nutriments['saturated-fat_100g'] || 'N/A'} g</td>
                </tr>
                <tr>
                    <td>Kohlenhydrate</td>
                    <td>${product.nutriments['carbohydrates_100g'] || 'N/A'} g</td>
                </tr>
                <tr>
                    <td>Zucker</td>
                    <td>${product.nutriments['sugars_100g'] || 'N/A'} g</td>
                </tr>
                <tr>
                    <td>Eiweiß</td>
                    <td>${product.nutriments['proteins_100g'] || 'N/A'} g</td>
                </tr>
                <tr>
                    <td>Salz</td>
                    <td>${product.nutriments['salt_100g'] || 'N/A'} g</td>
                </tr>
            </table>
        </div>
    `;

    displayNutritionChart(product.nutriments);
}

function displayNutritionChart(nutriments) {
    const ctx = document.getElementById('nutritionChart').getContext('2d');
    const chartData = {
        labels: ['Fett', 'Gesättigte Fettsäuren', 'Kohlenhydrate', 'Zucker', 'Eiweiß', 'Salz'],
        datasets: [{
            label: 'Nährwerte (pro 100g)',
            data: [
                nutriments['fat_100g'] || 0,
                nutriments['saturated-fat_100g'] || 0,
                nutriments['carbohydrates_100g'] || 0,
                nutriments['sugars_100g'] || 0,
                nutriments['proteins_100g'] || 0,
                nutriments['salt_100g'] || 0
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    if (window.nutritionChart) {
        window.nutritionChart.destroy();
    }

    window.nutritionChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Nährwerte Verteilung (pro 100g)'
                }
            }
        },
    });
}
