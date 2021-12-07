const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

   // Function to fetch the url html
   const getData = async (url) => {
    const result = await axios.get(url);
    return result.data;
    }

module.exports = {

    async checkAvailability(req, res) {
        const { domain } = req.params; 

        if(domain == undefined || domain == null || (domain.trim()).length < 1){
            res.status(400).json({error: 'Please inform a valid domain to search'})
            
        } else {

            const non_suported_tlds = ['.com.br', '.net.br', '.org.br', '.br'];
            const tld = domain.substring(domain.indexOf('.'));

            // Checking if the .tld of the informed domain is valid  
            for(i = 0; i < non_suported_tlds.length; i++){

                if(tld == non_suported_tlds[i]){
                    res.status(400).json({
                        error: `The tld ${tld} is not supported, please try a different one`,
                        non_suported_tlds: non_suported_tlds
                    });
                }
                
            }
    
            const search = await getData(`https://www.whois.com/whois/${domain}`);
            const $ = cheerio.load(search);

            // If defined, the domain is available for purchase
            const availability = $('.purchase .domain').text();

            if(availability.trim().length > 1 && availability != "" && availability != null){
                res.status(200).json({
                    result: `The domain ${domain} is available for purchase`,
                    domain_available: true
                });
            } else {

               // The domain is already registered 
                const domain_name = $('.df-value').html();
                const registration_date = $('.df-block .df-row .df-value').eq(2).text()
                const expiration_date = $('.df-block .df-row .df-value').eq(3).text()
                const status = $('.df-block .df-row .df-value').eq(5).text();

                const data = {
                    domain_name: domain_name,
                    registration_date: registration_date,
                    expiration_date: expiration_date,
                    status: status,
                    tld: tld
                }
        
                res.json(data);
            }

     
        };

      
    }
    
}