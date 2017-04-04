require 'minitest'

module CheckOutput
  def test_exit_status
    assert ok?
  end

  def test_dist_directory
    assert Dir.exist?(dist_dir)
  end

  def test_static_assets_directories
    assert Dir.exist?("#{dist_dir}/static")
    assert Dir.exist?("#{dist_dir}/static/css")
    assert Dir.exist?("#{dist_dir}/static/js")
    assert_equal 1, Dir.glob("#{dist_dir}/static/css/*.css").length
    assert_equal 1, Dir.glob("#{dist_dir}/static/js/*.js").length
  end

  def test_index_file_exists
    file = "#{dist_dir}/index.html"
    assert File.exist? file
  end

  def test_copied_static_files
    file = "#{dist_dir}/robots.txt"
    assert File.exist? file
  end

  def test_postcss
    file = Dir.glob("#{dist_dir}/static/css/*.css").first
    css = File.readlines(file).join('\n')

    assert css.include? '-ms-flexbox'
    assert !css.include?('.container')
  end
end

module CheckRender
  def test_layout_component
    file = "#{dist_dir}/index.html"

    html = File.read file
    assert html.include? 'id="container"'
    assert html.include? 'id="nav"'
    assert html.include? 'id="main"'
  end

  def test_generated_index_file
    file = "#{dist_dir}/index.html"
    assert File.exist? file

    html = File.read file
    assert html.include? 'Home</h1>'
  end

  def test_generated_nested_route
    file = "#{dist_dir}/about/index.html"
    assert File.exist? file

    html = File.read file
    assert html.include? 'About Us</h1>'
  end
end

module CheckSitemap
  def test_sitemap_generation
    file = "#{dist_dir}/sitemap.xml"
    assert File.exist? file

    xml = File.read file
    assert xml.include? '<loc>https://not.a.real.domain/about</loc>'
  end
end

module CheckNoSitemap
  def test_no_sitemap_generation
    file = "#{dist_dir}/sitemap.xml"
    assert !File.exist?(file)
  end
end

module CheckNoRender
  def test_no_generated_nested_route
    file = "#{dist_dir}/about/index.html"
    assert !File.exist?(file)
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
