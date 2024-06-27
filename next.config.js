/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "furnfeet.up.railway.app",
			},
		],
	},
	env:{
		RAZORPAY_KEY_ID:'rzp_test_y4wOGu5Ja28zmB',
		RAZORPAY_KEY_SECRET:'xwv3IgLyNOk2CaPsHdPZ9Nsx'
	}
};

module.exports = nextConfig;
