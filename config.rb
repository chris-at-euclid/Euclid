require 'euclid_crypt'

###
# Compass
###


# Susy grids in Compass
# First: gem install susy --pre
# require 'susy'

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# With alternative layout
page "/product.html", :layout => :contentpage
page "/privacy.html", :layout => :contentpage
page "/usrb/*", :layout => :contentpage
page "/sitemap.xml", :layout => false
page "/terms/standard/*", :layout => false

 with_layout :about do
   page "/about/*"
 end
 with_layout :products do
   page "/products/*"
   page "/department"
   page "/xirrus/*"
   page "/aerohive/*"
 end
 with_layout :privacy do
   page "/privacy/*"
 end
  with_layout :partners do
   page "/partners/*"
 end
   with_layout :partners do
   page "/plans/*"
 end
   with_layout :resources do
   page "/resources/*"
 end
   with_layout :support do
   page "/support/*"
 end
    with_layout :solutions do
   page "/specialty"
 end
     with_layout :solutions do
   page "/department"
 end
 with_layout :solutions do
   page "/solutions/*"
 end
 with_layout :pricing do
   page "/pricing/*"
 end

["standard"].each do |level|
  ["privacy", "legal"].each do |page|
    proxy "/terms/#{level}/#{page}.html", "/terms/template.html", :locals => { :path => "#{level}/#{page}", :withlayout => true }, :ignore => true
  end
end
["standard"].each do |level|
  ["privacy", "legal"].each do |page|
    proxy "/terms/#{level}/#{page}-text.html", "/terms/template.html", :locals => { :path => "#{level}/#{page}", :withlayout => false }, :ignore => true
  end
end


# page "/terms/standard/privacy.html", :proxy => "/terms/standard/privacy-text.html" do
#   @with_layout = true
# end

# Proxy (fake) files
# page "/this-page-has-no-template.html", :proxy => "/template-file.html" do
#   @which_fake_page = "Rendering a fake page with a variable"
# end

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Methods defined in the helpers block are available in templates
helpers do
  def nav_active(page)
    request.path.start_with?(page) ? "selected" : "u"
  end

  def page_class
    class_str = request.path.split('/').first
    if class_str == "" || class_str == "index.html"
      class_str = "home"
    end
    class_str
  end


  def link_to_signupsite(page, text, aclass)
    url = "https://signup.euclidelements.com/" + page
    "<a href='" + url + "' class='" + aclass + "'>" + text + "</a>"
  end


end

set :css_dir, 'css'

set :js_dir, 'js'

set :images_dir, 'img'

#blah/blahhh rather than blah/blahh.html
activate :directory_indexes

# Build-specific configuration
configure :build do

    # so there would be no need in invalidationg css-js files on cdn
  #activate :asset_hash

  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  # activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"


end

#Sync to S3
activate :s3_sync do |s3_sync|

  # old way
  # sync.fog_provider = 'AWS'
  # sync.fog_directory = ENV['env']
  # sync.fog_region = ''
  # sync.existing_remote_files = 'keep'

  s3_sync.bucket = ENV['env']
  s3_sync.aws_access_key_id = EuclidCrypt.decrypt(EuclidCrypt::EUCLID_SALT, ENV['s3_access_key_id'])
  s3_sync.aws_secret_access_key = EuclidCrypt.decrypt(EuclidCrypt::EUCLID_SALT, ENV['s3_secret_access_key'])

  s3_sync.delete = false
  s3_sync.after_build = false

end

caching_policy 'text/html', max_age:(60 * 60), must_revalidate: true
default_caching_policy max_age:(60 * 60 * 24), must_revalidate: true
