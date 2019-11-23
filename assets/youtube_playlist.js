---
# Script for the "Projet" page
---

(function() {
  function convertItem(item) {
    return {
      'title': item.snippet.title,
      'id': item.snippet.resourceId.videoId,
      'url': 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId,
      'thumbnail': 'https://img.youtube.com/vi/' +  item.snippet.resourceId.videoId + '/mqdefault.jpg'
    }
  }

  function downloadVideoList(playlistId) {
    var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + playlistId + '&key={{site.google_api_key}}';
    return axios.get(url)
      .then(function (response) {
        return response.data.items.map(convertItem)
      });
  }

  function renderVideoList() {
    var app = new Vue({
      el: '#youtube-playlist-app',
      data: {
        videos: [],
        playingVideoUrl: null,
      },
      methods: {
        play: function(id) {
          this.playingVideoUrl = "https://www.youtube.com/embed/" + id + "?rel=0&autoplay=1";
        },
        stop: function() {
          this.playingVideoUrl = null;
        }
      },
      mounted: function() {
        var playlistId = this.$el.getAttribute("data-playlist");
        downloadVideoList(playlistId)
          .then(function(videos) {
            this.videos = videos
          }.bind(this))
        window.addEventListener('hashchange', function() {
          var id =  window.location.hash.slice(1);
          if (id) this.play(id);
          else this.stop();
        }.bind(this));
      }
    });
  }

  document.addEventListener("DOMContentLoaded", renderVideoList, {once: true});
})();
