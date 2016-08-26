require 'minitest/autorun'

class TestPiezoBuild < MiniTest::Test
  @@dist = "#{__dir__}/fixture/dist"
  @@ok = system "rm -r #{@@dist} ; NODE_PATH=$NODE_PATH:#{__dir__}/../node_modules APP_ROOT=#{__dir__}/fixture #{__dir__}/../bin/piezo build"

  def test_exit_status
    assert @@ok
  end

  def test_dist_directory
    assert Dir.exist?(@@dist)
  end

  def test_static_assets_directories
    assert Dir.exist?("#{@@dist}/static")
    assert Dir.exist?("#{@@dist}/static/css")
    assert Dir.exist?("#{@@dist}/static/js")
    assert_equal 1, Dir.glob("#{@@dist}/static/css/*.css").length
    assert_equal 1, Dir.glob("#{@@dist}/static/js/*.js").length
  end

  def test_generated_index_file
    file = "#{@@dist}/index.html"
    assert File.exist? file

    html = File.read file
    assert html.include? 'Home</h1>'
  end

  def test_layout_component
    file = "#{@@dist}/index.html"

    html = File.read file
    assert html.include? 'id="container"'
    assert html.include? 'id="nav"'
    assert html.include? 'id="main"'
  end

  def test_generated_nested_route
    file = "#{@@dist}/about/index.html"
    assert File.exist? file

    html = File.read file
    assert html.include? 'About Us</h1>'
  end

  def test_sitemap_generation
    file = "#{@@dist}/sitemap.xml"
    assert File.exist? file

    xml = File.read file
    assert xml.include? '<loc>https://not.a.real.domain/about</loc>'
  end

  def test_copied_static_files
    file = "#{@@dist}/robots.txt"
    assert File.exist? file
  end
end
