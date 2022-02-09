/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	env: {
		APP_VERSION: process.env.npm_package_version,
	},
};
