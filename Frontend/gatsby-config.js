require("dotenv").config({
	path: `.env.${process.env.NODE_ENV}`,
})
/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
	pathPrefix: "/Sonic-Scribe",
	siteMetadata: {
		title: `Sonic Scribe`,
		siteUrl: `https://www.yourdomain.tld`,
	},
	plugins: [],
};
