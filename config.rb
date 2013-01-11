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

 with_layout :about do
   page "/about/*"
 end
 with_layout :product do
   page "/product/*"
 end
 with_layout :privacy do
   page "/privacy/*"
 end

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
    url = "https://signup.euclidanalytics.com/" + page
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