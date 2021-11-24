exports.generateProductHTML = ({product_title, product_by, product_cost, product_link, product_imgurl}) => {
    return `
	<div class="container">
		<div class="card">
			<div class="containedewar-fliud">
				<div class="wrapper row">
					<div class="preview col-md-6">
						
						<div class="preview-pic tab-content">
						  <div class="tab-pane active" id="pic-1"><img src="${product_imgurl}" /></div>
						</div>
						
					</div>
					<div class="details col-md-6">
						<h3 class="product-title">${product_title}</h3>
							<h4 class="price">By: <span>${product_by}</span></h4>	
            
						<p class="product-description">There's a story behind this purchase, but it hasn't been written yet.</p>
						<h4 class="price">Purchased At: <span>${product_cost}</span></h4>						
						<div class="action">
							<a class="add-to-cart btn btn-default" href="${product_link}" target="_blank">View on Amazon</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`
};