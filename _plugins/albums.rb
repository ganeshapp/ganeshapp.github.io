# Album generator.
#
# Albums are folders under assets/albums/. One folder per album:
#
#   assets/albums/cycling_trip/
#     0001.jpg     <- the first photo, and therefore the album's cover
#     0002.mp4
#     album.json   <- optional one-line "summary" and per-photo captions, written by glickr
#     album.md     <- optional long note, markdown, shown only on the album page
#
# Conventions, which the glickr app also implements:
#   - folder name -> title  ("cycling_trip" -> "Cycling Trip")
#   - everything sorts by filename, so filename order IS display order
#   - the cover is just the FIRST image in that order - there is no separate
#     cover file. A dedicated `0.jpg` used to exist and meant the cover was
#     stored twice: once as 0.jpg and once numbered, so it appeared in the
#     album twice with the caption attached to only one of them. Since 0 sorts
#     first anyway, an older album that still has a 0.jpg keeps working - it is
#     simply the first image.
#
# This used to also pull albums from a separate repo over jsDelivr, to keep
# photos off GitHub Pages' storage quota. That indirection is gone: photos now
# live in this repo, which removes a CDN dependency, a build-time network call,
# and the daily cron that existed only to notice pushes to the other repo.
require "json"

module Albums
  IMAGE_EXT = %w[.jpg .jpeg .png .gif .webp .avif].freeze
  VIDEO_EXT = %w[.mp4 .webm .mov].freeze

  class AlbumPage < Jekyll::PageWithoutAFile
    def initialize(site, slug, title, summary, note_md, cover, images)
      super(site, site.source, File.join("albums", slug), "index.md")
      @site = site
      self.content = note_md
      self.data = {
        "layout" => "album",
        "title" => title,
        "summary" => summary,
        "cover" => cover,
        "images" => images,
        "search" => true
      }
    end
  end

  module Helpers
    def self.titleize(folder)
      folder.tr("_-", "  ").split.map(&:capitalize).join(" ")
    end

    def self.strip_front_matter(text)
      text.sub(/\A---\s*\n.*?\n---\s*\n/m, "")
    end

    # Parse an album.json written by glickr. Never raises - a hand-mangled file
    # should cost the summary and captions, not the whole build.
    def self.read_json(path)
      return {} unless File.exist?(path)

      data = JSON.parse(File.read(path))
      data.is_a?(Hash) ? data : {}
    rescue StandardError => e
      Jekyll.logger.warn "Albums:", "bad album.json at #{path}: #{e.message}"
      {}
    end

    # { filename => caption }. Values are polymorphic on purpose: a bare string
    # in the common case, so the file stays hand-editable, and an object when
    # there is more than a caption to store.
    def self.captions(data)
      items = data["items"]
      return {} unless items.is_a?(Hash)

      items.each_with_object({}) do |(name, value), out|
        caption =
          case value
          when String then value
          when Hash then value["caption"]
          end
        out[name] = caption if caption.is_a?(String) && !caption.empty?
      end
    end
  end

  class Generator < Jekyll::Generator
    safe false
    priority :low

    def generate(site)
      albums_dir = File.join(site.source, "assets", "albums")
      return unless Dir.exist?(albums_dir)

      Dir.children(albums_dir).sort.each do |folder|
        dir = File.join(albums_dir, folder)
        next unless File.directory?(dir)
        next if folder.start_with?(".")

        files = Dir.children(dir).sort
        images = files.select { |f| IMAGE_EXT.include?(File.extname(f).downcase) }
        videos = files.select { |f| VIDEO_EXT.include?(File.extname(f).downcase) }
        next if images.empty? && videos.empty?

        # One sorted list, and the cover is its first image. Nothing is
        # excluded from the grid: hiding the cover made a photo the user had
        # uploaded simply disappear from the album it was the cover of.
        gallery = (images + videos).sort
        cover_file = images.first

        note_path = File.join(dir, "album.md")
        note = File.exist?(note_path) ? Helpers.strip_front_matter(File.read(note_path)) : ""
        json = Helpers.read_json(File.join(dir, "album.json"))
        summary = json["summary"].to_s.strip
        captions = Helpers.captions(json)

        base = "/assets/albums/#{folder}"
        items = gallery.map do |f|
          {
            "url" => "#{base}/#{f}",
            "video" => VIDEO_EXT.include?(File.extname(f).downcase),
            "caption" => captions[f]
          }
        end

        site.pages << AlbumPage.new(
          site,
          Jekyll::Utils.slugify(folder),
          Helpers.titleize(folder),
          summary.empty? ? nil : summary,
          note,
          cover_file ? "#{base}/#{cover_file}" : nil,
          items
        )
        Jekyll.logger.info "Albums:", "#{folder} (#{items.size} items)"
      end
    end
  end
end
