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
				hostname: "http://s0kkg0kk0oggs0kcko4go88k.82.29.161.80.sslip.io",
			},
		],
	},
};

module.exports = nextConfig;
