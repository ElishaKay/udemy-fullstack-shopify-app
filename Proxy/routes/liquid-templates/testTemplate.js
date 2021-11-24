exports.testTemplate = ({shop}) => {
    return `
		<div>
			Isaac's Dev Authorization Link: <a href='https://${shop}/community/posts?email={{ customer.email }}&hash={{ customer.email | append: "somecrazyhash" | md5 }}'>Do something that requires authorization</a>
		</div>
		<div>
			Elisha's Dev Authorization Link: <a href='https://${shop}/apps/tribe/user/profile?email={{ customer.email }}&name={{ customer.name }}&hash={{ customer.email | append: "somecrazyhash" | md5 }}'>My Tribe Profile</a>
		</div>
		`
};