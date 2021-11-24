
// module.exports = function(app,passport) {
//     // in order to allow server access from chrome extension
//     app.use(function(req, res, next) {
//       res.header("Access-Control-Allow-Origin", "*");
//       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//       next();
//     });

//     app.post('/api/save-yearly-products', async (req,res) => {
//         console.log('save-yearly-products request ',req.body);
//         let sqlToExecute = [];
//         let {multi_page,purchase_year} = req.body;

//         let insertProductsQuery = generateInsertProductsQuery(req.body); 
//         let insertYearQuery = generateInsertYearQuery(req.body);

//         sqlToExecute.push(insertProductsQuery, insertYearQuery);        

//         executeSQL(sqlToExecute)
//             .then(sqlResponse => res.json({multi_page,purchase_year,sqlResponse}))
//             .catch(err => console.log('err: ',err));

//     });     
// }


 
function generateInsertYearQuery({client_id, purchase_year, page_number, multi_page, total_pages}) { 
      let insertYearQuery =     
           
            `INSERT INTO purchase_year (client_id, purchase_year, page_number, multi_page, total_pages, created_at, updated_at)
                VALUES (
              '${client_id}', 
              '${purchase_year}', 
              '${page_number}', 
              '${multi_page}',
              '${total_pages}',
                NOW(),
                NOW())`;

      console.log('insertYearQuery: ',insertYearQuery);
      return insertYearQuery;
}


function generateInsertProductsQuery({client_id, purchase_year, orderDetails}) { 
      let insertProductsQuery =     
            `INSERT INTO product (product_title, product_by, product_cost, product_link, 
                product_imgurl, purchase_year, client_id, created_at, updated_at)
                VALUES`

      for (let y = 0; y < orderDetails.length; y++) { 
          let {product_title, product_by, product_cost, product_link, product_imgurl} = orderDetails[y];

          insertProductsQuery += `${y===0 ? '' : ','} (
              '${formatQuotes(product_title)}', 
              '${formatQuotes(product_by)}', 
              '${product_cost}', 
              '${product_link}', 
              '${product_imgurl}',
              '${purchase_year}',
              '${client_id}',
                NOW(),
                NOW())`;              
      }

      // console.log('insertProductsQuery: ',insertProductsQuery);
      return insertProductsQuery;
}