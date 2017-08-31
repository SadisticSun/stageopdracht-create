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
      $$: function (element) {
        return document.querySelector(element);
      }
    },

    /* DOM elements
    ========================================================================= */
    elements: {
      sections: {
        index: document.getElementById('index'),
        new: document.getElementById('new'),
        details: document.getElementById('details'),
        about: document.getElementById('about')
      },
      navigation: {
        index: document.getElementById('index-link'),
        about: document.getElementById('about-link')
      },
      buttons: {
        addNew: document.getElementById('add-post')
      },
      forms: {
        newPostForm: document.getElementById('new-post-form')
      }
    },

    /* Client-side routing
    ========================================================================= */
    routes: {
      init: function () {
        routie({
          '': function () {
            location.hash = "#index";
          },
          'index': function () {
            app.elements.buttons.addNew.classList.remove('hidden');
            app.elements.navigation.index.classList.add('active');
            app.elements.navigation.about.classList.remove('active');
            app.elements.sections.about.classList.add('hidden');
            app.elements.sections.details.classList.add('hidden');
            app.elements.sections.index.classList.remove('hidden');
            app.elements.sections.new.classList.add('hidden');
            app.clearPosts();
            app.renderIndexWithPosts();
          },
          'about': function () {
            app.elements.buttons.addNew.classList.add('hidden');
            app.elements.sections.new.classList.add('hidden');
            app.elements.navigation.about.classList.add('active');
            app.elements.navigation.index.classList.remove('active');
            app.elements.sections.index.classList.add('hidden');
            app.elements.sections.details.classList.add('hidden');
            app.elements.sections.about.classList.remove('hidden');
            app.clearPosts();
          },
          'new': function () {
            app.elements.buttons.addNew.classList.add('hidden');
            app.elements.sections.new.classList.remove('hidden');
            app.clearPosts();
            app.renderNewPostPage();
          },
          'details/:id': function (id) {
            app.elements.buttons.addNew.classList.add('hidden');
              app.elements.sections.new.classList.add('hidden');
              app.elements.navigation.index.classList.remove('active');
              app.elements.navigation.about.classList.remove('active');
              app.elements.sections.index.classList.add('hidden');
              app.elements.sections.details.classList.remove('hidden');
              app.renderDetailPage(id);
          }
        });
      }
    },

    /* ======================================================================
    Helper methods
    ========================================================================= */ 

    /* Get posts from API and render index section with results
    ===================== */
    renderIndexWithPosts: function () {
      // Get data from Create API
      aja()
      .url(app.config.apiURL)
      .on('success', function (data) {
        console.log(data);
        if (Array.isArray(data.data)) {
          data.data.forEach(function (post) {

            app.elements.sections.index.innerHTML +=
              '<div class="blog-post">' +
              '<div class="img-container">' +
              app.checkForImage(post) +
              '</div>' +
              '<div class="meta-container">' +
                '<h3 class="blog-post-title">' + post.title + '</h3>' +
                '<p class="blog-post-content">' + post.content + '</p>' +
                '<a class="detail-link" href="#details/' + post.id + '">Lees meer <i class="fa fa-arrow-right" aria-hidden="true"></i></a>' +
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

    /* Get single post from API and render the detail section
    ===================== */
    renderDetailPage: function (postId) {
      aja()
      .url(app.config.apiURL + '/' + postId)
      .on('success', function (data){
        var post = data.data;
        console.log(data);
        app.elements.sections.details.innerHTML =
        '<div class="blog-post-detail">' +
          '<h3 class="blog-post-title">' + post.title + '</h3>' +
          '<p class="blog-post-content">' + post.content + '</p>' +
        '</div>';
      })
      .go();
    },

    renderNewPostPage: function () {
      app.elements.forms.newPostForm.innerHTML =
       '<input type="text" name="title" placeholder="Geef een titel op">' +
       '<textarea name="content" placeholder="Berichtinhoud"></textarea>' + 
       '<input type="text" name="image" placeholder="URL naar afbeelding (bijv. http://domein.nl/afbeelding.jpg)">' +
       '<input class="form-submit" type="submit" value="Opslaan">';
      
       app.elements.forms.newPostForm.addEventListener('submit', function (event) {
         event.preventDefault();

         var formData = new FormData(this);

          for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
          }
        app.saveNewPost(formData.entries());
       })
    },

    /* Save new post to API
    ===================== */

    saveNewPost: function (newPost) {

      aja()
      .method('post')
      .header('Content-Type', 'application/json')
      .url(app.config.apiURL)
      .body(newPost)
      .on('200', function(response){
        location.hash = 'index';
      })
      .go();
    },

    /* Check if post has image, else => use placeholder
    ===================== */
    checkForImage: function (blogpost) {
      if (blogpost.image == null) {
        var html = '<img class="blog-post-img" src="images/placeholder.gif" alt="Geen afbeelding">';
        return html;
      } else {
        var html = '<img class="blog-post-img" src="'+ blogpost.image + '">';
        return html;
      }
    },

    /* Empty the index section
    ===================== */
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
