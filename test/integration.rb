require 'minitest'

module CheckOutput
  def test_exit_status
    assert ok?, 'Built Successfully'
  end

  def test_dist_directory
    assert Dir.exist?(dist_dir), 'Dist directory created'
  end

  def test_static_assets_directories
    assert Dir.exist?("#{dist_dir}/static"), 'Has Static Directory'
    assert Dir.exist?("#{dist_dir}/static/css"), 'Has Static CSS Directory'
    assert Dir.exist?("#{dist_dir}/static/js"), 'Has Static JS Directory'
    assert_equal 1, Dir.glob("#{dist_dir}/static/css/*.css").length, 'Correct number of CSS files'
    assert_equal 1, Dir.glob("#{dist_dir}/static/js/*.js").length, 'Correct number of JS files'
  end

  def test_index_file_exists
    file = "#{dist_dir}/index.html"
    assert File.exist?(file), 'Created index.html file'
  end

  def test_copied_static_files
    file = "#{dist_dir}/robots.txt"
    assert File.exist?(file), 'Copied over robots.txt file'
  end

  def test_postcss
    file = Dir.glob("#{dist_dir}/static/css/*.css").first
    css = File.readlines(file).join('\n')

    assert css.include?('-ms-flexbox'), 'Autoprefixer is working'
    assert !css.include?('.container'), 'CSS module names are working'
    assert !css.include?('undefined'), 'No CSS module problems'
  end
end

module CheckRender
  def test_layout_component
    file = "#{dist_dir}/index.html"

    html = File.read file
    assert html.include?('id="container"'), 'Rendered container element'
    assert html.include?('id="nav"'), 'Rendered nav element'
    assert html.include?('id="main"'), 'Rendered main element'
  end

  def test_generated_index_file
    file = "#{dist_dir}/index.html"
    assert File.exist?(file), 'Generated index.html file'

    html = File.read file
    assert html.include?('Home</h1>'), 'Correct'
    assert html.include?('Home Page Title - Test Site</title>'), 'Correct Home Page Title'
  end

  def test_generated_nested_route
    file = "#{dist_dir}/about.html"
    assert File.exist?(file), 'Generated about.html file'

    html = File.read file
    assert html.include?('About</h1>'), 'Correct About Content'
    assert html.include?('About Page Title - Test Site</title>'), 'Correct About Page Title'
  end
end

module CheckSitemap
  def test_sitemap_generation
    file = "#{dist_dir}/sitemap.xml"
    assert File.exist?(file), 'Rendered sitemap.xml'

    xml = File.read file
    assert xml.include?('<loc>https://not.a.real.domain/about</loc>'), 'Sitemap file has content'
  end
end

module CheckNoSitemap
  def test_no_sitemap_generation
    file = "#{dist_dir}/sitemap.xml"
    assert !File.exist?(file), 'Did not render sitemap.xml'
  end
end

module CheckNoRender
  def test_no_generated_nested_route
    file = "#{dist_dir}/about.html"
    assert !File.exist?(file), 'Did not render nested routes'
  end
end

def piezo(dist, args = '')
  system "test -d #{dist} && rm -r #{dist} ; NODE_PATH=$NODE_PATH:#{__dir__}/../node_modules APP_ROOT=#{__dir__}/fixture DIST_DIR=#{dist} #{__dir__}/../bin/piezo build #{args}"
end

class TestPiezoBuild < MiniTest::Test
  @@dist = "#{__dir__}/fixture/dist1"
  @@ok = piezo(@@dist)

  def dist_dir
    @@dist
  end

  def ok?
    @@ok
  end

  include CheckOutput
  include CheckRender
  include CheckSitemap
end

class TestPiezoBuildNoRender < MiniTest::Test
  @@dist = "#{__dir__}/fixture/dist2"
  @@ok = piezo @@dist, '--no-render'

  def dist_dir
    @@dist
  end

  def ok?
    @@ok
  end

  include CheckOutput
  include CheckSitemap
end

class TestPiezoBuildNoSitemap < MiniTest::Test
  @@dist = "#{__dir__}/fixture/dist3"
  @@ok = piezo @@dist, '--no-sitemap'

  def dist_dir
    @@dist
  end

  def ok?
    @@ok
  end

  include CheckOutput
  include CheckRender
  include CheckNoSitemap
end

class TestPiezoBuildNoRenderNoSitemap < MiniTest::Test
  @@dist = "#{__dir__}/fixture/dist4"
  @@ok = piezo @@dist, '--no-render --no-sitemap'

  def dist_dir
    @@dist
  end

  def ok?
    @@ok
  end

  include CheckOutput
  include CheckNoSitemap
  include CheckNoRender
end

reporter = Minitest::SummaryReporter.new

TestPiezoBuild.run(reporter)
TestPiezoBuildNoRender.run(reporter)
TestPiezoBuildNoSitemap.run(reporter)
TestPiezoBuildNoRenderNoSitemap.run(reporter)

puts reporter

exit reporter.passed?
