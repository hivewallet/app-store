describe("appElement", function() {
  var manifest = {
    "name": "Bitstamp",
    "id": "com.hivewallet.bitstamptrader",
    "version": "1.2.1",
    "author": "Taylor Gerring",
    "description": "Buy, sell and trade Bitcoin for USD, EUR and more.",
    "icon": "images/icon.png",
    "accessedHosts": [
      "www.bitstamp.net"
    ]
  }

  var el;

  beforeEach(function(){
    el = appElement(manifest)
  })

  it("renders its icon", function() {
    var expectedImageUrl = 'https://hive-app-registry.herokuapp.com/com.hivewallet.bitstamptrader/images/icon.png'
    expect(el.querySelector('img').src).toEqual(expectedImageUrl)
  })

  it("renders app name", function() {
    expect(el.querySelector('h4').textContent).toEqual(manifest.name)
  })

  it("renders app descriptoin", function() {
    expect(el.innerHTML).toContain(manifest.description)
  })

  context('when the app is installed', function(){
    context('when the app version is the same as that of the manifest', function(){
      beforeEach(function(done){
        spyOn(bitcoin, 'getApplication').and.callFake(function(appId, callback){
          setTimeout(function(){
            callback({id: appId, version: manifest.version})
            done()
          }, 0)
        })
        el = appElement(manifest)
      })

      it('renders text `Installed` instead of the install button', function(){
        expect(el.querySelector('button.btn.btn-primary')).toBeNull()
        expect(el.textContent).toContain('Installed')
      })
    })

    context('when the app version different from that of the manifest', function(){
      beforeEach(function(done){
        spyOn(bitcoin, 'getApplication').and.callFake(function(appId, callback){
          setTimeout(function(){
            callback({id: appId, version: '0.0.1'})
            done()
          }, 0)
        })
        el = appElement(manifest)
      })

      it('renders update button', function(){
        expect(el.querySelector('button').textContent).toEqual('Update')
      })
    })
  })

  context('when the app is not installed', function(){
    beforeEach(function(done){
      spyOn(bitcoin, 'getApplication').and.callFake(function(appId, callback){
        setTimeout(function(){
          callback(null)
          done()
        }, 0)
      })
      el = appElement(manifest)
    })

    describe("install button", function(){
      var button;

      beforeEach(function(){
        button = el.querySelector('button')
      })

      it("renders", function() {
        expect(button.textContent).toEqual('Install')
      })

      it("clicks on the button invokes bitcoin.installApp with the app bundle url", function() {
        spyOn(bitcoin, 'installApp')
        button.click()
        expect(bitcoin.installApp).toHaveBeenCalled()

        var args = bitcoin.installApp.calls.mostRecent().args
        expect(args[0]).toEqual('https://hive-app-registry.herokuapp.com/com.hivewallet.bitstamptrader.hiveapp')
      })

      describe("installApp callback", function() {
        var callback;
        beforeEach(function(){
          spyOn(bitcoin, 'installApp')
          spyOn(window, 'alert')
          button.click()
          callback = bitcoin.installApp.calls.mostRecent().args[1]
        })

        it("replace the button with success text when success", function() {
          expect(el.textContent).not.toContain('Installed')
          callback(null, true)
          expect(el.textContent).toContain('Installed')
          expect(el.querySelector('button.btn.btn-primary')).toBeNull()
        })

        context("install failure", function() {
          it("leave the button be", function() {
            callback(new Error(), false)
            expect(el.textContent).not.toContain('Installed')
            expect(el.querySelector('button')).toBeDefined()
          })

          it("show an alert with error message", function() {
            callback(new Error('oh no!'), false)
            expect(window.alert).toHaveBeenCalledWith('oh no!')
          })
        })

        context("user cancels install", function() {
          it("leave the button be", function() {
            callback(null, false)
            expect(el.textContent).not.toContain('Installed')
            expect(el.querySelector('button')).toBeDefined()
          })

          it("does not show alert", function() {
            callback(null, false)
            expect(window.alert).not.toHaveBeenCalled()
          })
        })
      })
    })
  })
});
