module.exports = {
  siteUrl: 'https://www.aom.gg',
  generateRobotsTxt: true, // Generate robots.txt file
  changefreq: 'daily', // Default change frequency for all pages
  priority: 0.7, // Default priority for all pages
  sitemapBaseFileName: 'sitemap-0',

  // Define specific options for pages if needed
  transform: async (config, path) => {
    // Customize settings based on the path
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
      };
    }
    if (path.startsWith('/profile/')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.8,
      };
    }
    if (path.startsWith('/recs') || path.startsWith('/resources')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.6,
      };
    }
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.5,
    };
  },

  // Optionally exclude paths from the sitemap
  exclude: ['/admin/*'],

  // Customize robots.txt if needed
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
    ],
  },
};
