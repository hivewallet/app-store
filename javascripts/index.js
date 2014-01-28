var createCORSRequest = function(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // Most browsers.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // IE8 & IE9
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
};

function fetchApp(repoUrl) {
  var tree;
  var manifest;

  function getTags(userAndProject) {
    var url = 'https://api.github.com/repos/' + userAndProject + '/tags';
    var xhr = createCORSRequest('GET', url);

    xhr.onload = function(e) {
      var lastTag = JSON.parse(xhr.response)[0]
      if(lastTag) { getTree(userAndProject, lastTag.commit.sha) }
    };

    xhr.onerror = function() {
      // Error code goes here.
    };

    xhr.send();
  }


  function getTree(userAndProject, sha) {
    var url = 'https://api.github.com/repos/' + userAndProject + '/git/trees/' + sha + '?recursive=1';
    var xhr = createCORSRequest('GET', url);

    xhr.onload = function(e) {
      tree = JSON.parse(xhr.response).tree
      var manifest = tree.filter(function(node){
        return node.path === "manifest.json"
      })[0]
      if(manifest) { getManifest(manifest.url) }
    };

    xhr.onerror = function() {
      // Error code goes here.
    };

    xhr.send();
  }

  function getManifest(url){
    var xhr = createCORSRequest('GET', url);

    xhr.onload = function(e) {
      var content = JSON.parse(xhr.response).content
      manifest = JSON.parse(atob(content.replace(/\s/g, '')))
      var item = document.createElement("a")
      item.setAttribute("class", "list-group-item media")

      var imageContainer = document.createElement("div")
      imageContainer.setAttribute("class", "pull-left")

      var img = document.createElement("img");
      img.setAttribute('class', "media-object");
      img.setAttribute('height', '64px');
      img.setAttribute('width', '64px');

      var textContainer = document.createElement("div")
      textContainer.setAttribute("class", "media-body")

      var heading = document.createElement("h4")
      textContainer.setAttribute("class", "media-heading")
      heading.innerHTML = manifest.name

      var paragraph = document.createTextNode(manifest.author)

      imageContainer.appendChild(img)
      item.appendChild(imageContainer)

      textContainer.appendChild(heading)
      textContainer.appendChild(paragraph)
      item.appendChild(textContainer)

      document.querySelector(".list-group").appendChild(item)

      getIcon(manifest.icon, img)
    };

    xhr.onerror = function() {
      // Error code goes here.
    };

    xhr.send();
  }

  function getIcon(iconPath, img) {
    var icon = tree.filter(function(node){
      return node.path == iconPath
    })[0]
    if(icon) {
      var xhr = createCORSRequest('GET', icon.url);

      xhr.onload = function(e) {
        var content = JSON.parse(xhr.response).content
        var src = "data:image/png;base64, " + content.replace(/\s/g, '')
        img.setAttribute('src', src);
      };

      xhr.onerror = function() {
        // Error code goes here.
      };

      xhr.send();
    }
  }

  getTags(repoUrl.replace("https://github.com/", ""));
}

fetchApp("https://github.com/hivewallet/hiveapp-supporthive")

