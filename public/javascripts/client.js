(function() {
  'use strict';

  var app = {

    /* App config variables
    ========================================================================= */
    config: {
      apiURL: 'http://stageopdracht.cdemo.nl/api/posts'
    },

    /* Utilities, like JQuery style selectors
    ========================================================================= */
    utils: {
      $: function (element) {
        return document.getElementById(element);
      },
      $$: function (elements) {
        return document.querySelectorAll(elements);
      }
    },

    /* DOM elements
    ========================================================================= */
    elements: {
      sections: {
        index: document.getElementById('index'),
        details: document.getElementById('details'),
        about: document.getElementById('about')
      },
      navigation: {
        index: document.getElementById('index-link'),
        about: document.getElementById('about-link')
      }
    },

    /* Client-side routing
    ========================================================================= */
    routes: {
      init: function () {
        routie({
          '': function () {
            location.hash = "#index"
          },
          'index': function() {
            app.elements.navigation.index.classList.add('active');
            app.elements.navigation.about.classList.remove('active');
            app.elements.sections.about.classList.add('hidden');
            app.elements.sections.details.classList.add('hidden');
            app.elements.sections.index.classList.remove('hidden');
            app.renderIndexWithPosts();
          },
          'about': function () {
            app.elements.navigation.about.classList.add('active');
            app.elements.navigation.index.classList.remove('active');
            app.elements.sections.index.classList.add('hidden');
            app.elements.sections.details.classList.add('hidden');
            app.elements.sections.about.classList.remove('hidden');
            app.clearPosts();
          },
          'details/:id': function(id) {
              app.elements.navigation.index.classList.remove('active');
              app.elements.navigation.about.classList.remove('active');
              app.elements.sections.index.classList.add('hidden');
              app.elements.sections.details.classList.remove('hidden');
              app.renderDetailPage(id);
              console.log('showing details');
          }
        });
      }
    },

    renderIndexWithPosts: function () {
      // Get data from Create API
      aja()
      .url(app.config.apiURL)
      .on('success', function(data){
        console.log(data);
        if (Array.isArray(data.data)) {
          data.data.forEach(function(post) {

            app.elements.sections.index.innerHTML +=
              '<div class="blog-post">' +
              '<div class="img-container">' +
              app.checkForImage(post) +
              '</div>' +
              '<div class="meta-container">' +
                '<h3 class="blog-post-title">' + post.title + '</h3>' +
                '<p class="blog-post-content">' + post.content + '</p>' +
                '<a class="detail-link" href="#details/' + post.id + '">Bekijken <i class="fa fa-arrow-right" aria-hidden="true"></i></a>' +
              '</div>'+
              '</div>';
          });
        } else {
          app.elements.sections.index.innerHTML =
            '<p>Geen berichten gevonden</p>';
        };
      })
      .go();
    },

    renderDetailPage: function (postId) {
      // Get data from Create API
      aja()
      .url(app.config.apiURL + '/' + postId)
      .on('success', function(data){
        var post = data.data;
        console.log(data);
        app.elements.sections.details.innerHTML =
        '<div class="blog-post-detail">' +
        app.checkForImage(data) +
          '<h3 class="blog-post-title">' + post.title + '</h3>' +
          '<p class="blog-post-content">' + post.content + '</p>' +

        '</div>';
      })
      .go();
    },

    checkForImage: function(blogpost) {
      if (blogpost.image == null) {
        var html = '<img class="blog-post-img" src="images/placeholder.gif" alt="Geen afbeelding">';
        return html;
      } else {
        var html = '<img class="blog-post-img" src="'+ blogpost.image + '">';
        return html;
      }
    },

    clearPosts: function () {
      app.elements.sections.index.innerHTML = '';
    },

    /* Main initalizer
    ========================================================================= */
    init: function () {
      app.routes.init();
    }
  // END OF APP
  }

  /* Initialize app
  ========================================================================= */
  app.init();
}());
