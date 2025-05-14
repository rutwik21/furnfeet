/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "http",
				hostname: "192.168.1.9",
			},
			{
				protocol: "https",
				hostname: "furnfeet.82.29.161.80.sslip.io",
			},
		],
	},
};

module.exports = nextConfig;
