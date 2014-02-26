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

  describe("install button", function(){
    var button;

    beforeEach(function(){
      button = el.querySelector('button')
    })

    it("renders", function() {
      expect(button.textContent).toEqual('Install')
    })

    it("clicks on the button invokes bitcoin.installApp", function() {
      spyOn(bitcoin, 'installApp')
      button.click()
      expect(bitcoin.installApp).toHaveBeenCalled()
    })
  })
});
