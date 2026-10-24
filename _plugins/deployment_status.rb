# Lets the writing apps verify the deployed revision and actual Jekyll URLs.
require 'json'

Jekyll::Hooks.register :site, :post_write do |site|
  revision = ENV['GITHUB_SHA']
  next unless revision && revision.match?(/\A[0-9a-f]{40}\z/)

  pages = {}
  site.collections.each_value do |collection|
    collection.docs.each do |doc|
      next unless doc.write? && File.file?(doc.destination(site.dest))
      pages[doc.relative_path.sub(%r{\A/}, '')] = doc.url
    end
  end
  File.write(File.join(site.dest, 'deployment.json'),
             JSON.generate({ commit: revision, pages: pages }))
end
