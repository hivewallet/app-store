var registryBaseURL = 'https://hive-app-registry.herokuapp.com/'
function listApps(){
  var url = registryBaseURL + 'index.json'
  bitcoin.makeRequest(url, {
    success: function(apps) {
      console.log("success: ", apps)
      hideSpinner()
      apps.forEach(displayApp)
    },
    error: function(){
      console.error("error", arguments)
    }
  })
}

function displayApp(manifest){
  var itemContainer = document.createElement("div")
  itemContainer.setAttribute("class", "list-group-item row")

  var item = document.createElement("div")
  item.setAttribute("class", "media col-xs-10")

  var imageContainer = document.createElement("div")
  imageContainer.setAttribute("class", "pull-left")

  var img = document.createElement("img");
  img.setAttribute('class', "media-object");
  img.setAttribute('height', '64px');
  img.setAttribute('width', '64px');
  var src = registryBaseURL + manifest.id + '/' + manifest.icon;
  img.setAttribute('src', src)

  var textContainer = document.createElement("div")
  textContainer.setAttribute("class", "media-body")

  var heading = document.createElement("h4")
  heading.setAttribute("class", "media-heading")
  heading.innerHTML = manifest.name

  var paragraph = document.createTextNode(manifest.author)

  var button = document.createElement("button")
  button.setAttribute("class", "btn btn-default col-xs-2")
  button.textContent = "Install"

  imageContainer.appendChild(img)
  item.appendChild(imageContainer)

  textContainer.appendChild(heading)
  textContainer.appendChild(paragraph)
  item.appendChild(textContainer)

  itemContainer.appendChild(item)
  itemContainer.appendChild(button)

  document.querySelector(".list-group").appendChild(itemContainer)
}

function hideSpinner(){
  document.querySelector('.spinner-container').style.setProperty("display", "none")
}

listApps()

