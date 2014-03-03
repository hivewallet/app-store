var registryBaseURL = 'https://hive-app-registry.herokuapp.com/'
function listApps(){
  var url = registryBaseURL + 'index.json'
  bitcoin.makeRequest(url, {
    success: function(apps) {
      hideSpinner()
      var container = document.querySelector(".list-group")
      apps.sort(function(a, b){
        if(typeof a.name !== "string") return -1
        return a.name.localeCompare(b.name)
      }).forEach(function(manifest){
        var item = appElement(manifest)
        container.appendChild(item)
      })
    },
    error: function(){
      console.error("error", arguments)
    }
  })
}

function appElement(manifest){
  var itemContainer = document.createElement("div")
  itemContainer.setAttribute("class", "list-group-item row")

  var item = document.createElement("div")
  item.setAttribute("class", "media col-xs-9")

  var imageContainer = document.createElement("div")
  imageContainer.setAttribute("class", "pull-left")

  var img = document.createElement("img");
  img.setAttribute('class', "media-object");
  img.setAttribute('height', '50px');
  img.setAttribute('width', '50px');
  var src = registryBaseURL + manifest.id + '/' + manifest.icon;
  img.setAttribute('src', src)

  var textContainer = document.createElement("div")
  textContainer.setAttribute("class", "media-body")
  var appDetails = manifest.name + " by " + manifest.author + "\n" + manifest.description
  textContainer.setAttribute("title", appDetails)

  var heading = document.createElement("h4")
  heading.setAttribute("class", "media-heading")
  heading.innerHTML = manifest.name

  var paragraph = document.createTextNode(manifest.description)

  var buttonContainer = document.createElement("div")
  buttonContainer.setAttribute("class", "col-xs-3 text-center button-container")
  populateButtonContainer(buttonContainer, manifest)

  imageContainer.appendChild(img)
  item.appendChild(imageContainer)

  textContainer.appendChild(heading)
  textContainer.appendChild(paragraph)
  item.appendChild(textContainer)

  itemContainer.appendChild(item)
  itemContainer.appendChild(buttonContainer)

  return itemContainer
}

function populateButtonContainer(buttonContainer, manifest){
  bitcoin.getApplication(manifest.id, function(app){
    if(app) {
      if(app.version === manifest.version){
        setButtonToSuccessText(buttonContainer)
      } else {
        buttonContainer.appendChild(buttonElement('Update'))
      }
    } else {
      buttonContainer.appendChild(buttonElement('Install'))
    }
  })

  function buttonElement(text) {
    var button = document.createElement("button")
    button.setAttribute("class", "btn btn-primary")
    button.textContent = text
    button.addEventListener('click', function(e){
      replaceButtonWithSpinner(buttonContainer, button)
      installApp(manifest, buttonContainer, button)
    })

    return button
  }
}

function replaceButtonWithSpinner(buttonContainer, button){
  buttonContainer.removeChild(button)

  var spinner = document.createElement('span')
  spinner.setAttribute('class', "glyphicon glyphicon-refresh spinner")
  buttonContainer.appendChild(spinner)
}

function installApp(manifest, buttonContainer, button){
  bitcoin.installApp(registryBaseURL + manifest.id + '.hiveapp', function(err, installed){
    if (installed) {
      setButtonToSuccessText(buttonContainer)
    } else if (err) {
      alert(err.message);
      replaceSpinnerWithButton()
    } else {
      replaceSpinnerWithButton()
    }
  })

  function replaceSpinnerWithButton(){
    buttonContainer.innerHTML = ''
    buttonContainer.appendChild(button)
  }
}

function setButtonToSuccessText(buttonContainer){
  buttonContainer.innerHTML = '<button class="btn btn-empty text-success" disabled="disabled">Installed</button>'
}

function hideSpinner(){
  document.querySelector('.spinner-container').style.setProperty("display", "none")
}

listApps()

