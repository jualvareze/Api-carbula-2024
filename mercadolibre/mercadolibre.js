




import { chromium } from 'playwright';


function calculateAveragePrice(prices) {

    const numbers = prices.map(priceObj => {
        return parseFloat(priceObj.priceCar.replace(/\./g, ''));
    });
    const total = numbers.reduce((sum, price) => sum + price, 0);
    const average = total / numbers.length;
    return average.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}





async function scrapeWeb(page) {
    let carsList = [];


    while (true) {
        const newCars = await page.evaluate(() => {
            const cars = document.querySelectorAll('.ui-search-layout__item');
            const listCars = [];

            cars.forEach(card => {
                const priceElem = card.querySelector('.andes-money-amount__fraction');
                const priceCar = priceElem ? priceElem.textContent.trim() : 'No price';
                if (priceCar) {
                    listCars.push({ priceCar });
                }
            });

            return listCars;
        }
        );


        carsList.push(...newCars);


        const nextButton = await page.$('.andes-pagination__button--next');



        if (nextButton) {
            let isVisible = await nextButton.isVisible();

            if (isVisible) {
                await nextButton.click();
            } else {
                console.log("No hay más páginas disponibles.");
                break; 
            }
        } else {
            console.log("No se encontró el botón para la siguiente página.");
            break; 
        }
    }
    return carsList;
}


    async function scrapeAll(marca,modelo,ano) {
        const baseUrl = `https://autos.mercadolibre.cl/${marca}/${modelo}/rm-metropolitana/${ano}/`
       
        console.log(baseUrl)

        const browser = await chromium.launch({
            headless: true,  //  modo no visible
            slowMo: 5000      // Ralentizar las acciones
        });

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            viewport: { width: 1366, height: 768 }
        });


        const page = await context.newPage();

        await page.goto(baseUrl)
        const listPage = await scrapeWeb(page)
        let price = calculateAveragePrice(listPage)
        await browser.close();
        console.log(listPage)
        return {listPage,price}
    }

    export default scrapeAll