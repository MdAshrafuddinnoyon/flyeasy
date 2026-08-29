function generateEmailTemplate({ title, content, siteData = {} }) {
  let finalHtml = content || "";

  // The template itself is now completely provided by the user in the admin panel (HTML Body)
  // We just need to parse the dynamic variables using the siteData from the database.

  const variables = {
    '[Site Name]': siteData.site_name || 'FlyEasy',
    '[Site Domain]': siteData.site_domain || 'flyeasy.com',
    '[Site Logo]': siteData.email_logo_url || siteData.logo_light_url || 'https://via.placeholder.com/150x50?text=Logo',
    '[Contact Email]': siteData.contact_email || 'support@flyeasy.com',
    '[Phone]': siteData.contact_phone || '',
    '[WhatsApp]': siteData.contact_whatsapp || '',
    '[Address]': siteData.contact_address || '',
    '[Facebook]': siteData.social_facebook || '#',
    '[Instagram]': siteData.social_instagram || '#',
    '[Title]': title || '',
  };

  // Replace all occurrences of the variables
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    finalHtml = finalHtml.replace(regex, variables[key] || '');
  });

  return finalHtml;
}

module.exports = { generateEmailTemplate };
