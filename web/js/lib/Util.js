export default class Util {
  // https://gist.github.com/ghinda/8442a57f22099bdb2e34#gistcomment-1547582
  static modelToFormData (data, form = null, namespace = '') {
    let files = {}
    let model = {}
    for (let propertyName in data) {
      if (data.hasOwnProperty(propertyName) && data[propertyName] instanceof File) {
        files[propertyName] = data[propertyName]
      } else {
        model[propertyName] = data[propertyName]
      }
    }

    model = JSON.parse(JSON.stringify(model))
    let formData = form || new FormData()

    for (let propertyName in model) {
      if (!model.hasOwnProperty(propertyName) || !model[propertyName]) continue
      let formKey = namespace ? `${namespace}[${propertyName}]` : propertyName
      if (model[propertyName] instanceof Date) { formData.append(formKey, model[propertyName].toISOString()) } else if (model[propertyName] instanceof File) {
        formData.append(formKey, model[propertyName])
      } else if (model[propertyName] instanceof Array) {
        model[propertyName].forEach((element, index) => {
          const tempFormKey = `${formKey}[${index}]`
          if (typeof element === 'object') this.modelToFormData(element, formData, tempFormKey)
          else formData.append(tempFormKey, element.toString())
        })
      } else if (typeof model[propertyName] === 'object' && !(model[propertyName] instanceof File)) { this.modelToFormData(model[propertyName], formData, formKey) } else {
        formData.append(formKey, model[propertyName].toString())
      }
    }

    for (let propertyName in files) {
      if (files.hasOwnProperty(propertyName)) {
        formData.append(propertyName, files[propertyName])
      }
    }
    return formData
  }

  static cleanPath (str) {
    if (str === '/') return str
    str = ('/' + str).replace(/[\//]+/g, '/')
    // if (str.startsWith('/')) str = str.substr(1)
    if (str.endsWith('/')) str = str[0, str.length - 1]
    return str
  }

  static parentPath (str) {
    let prevPath = str.split('/')
    prevPath.pop()
    prevPath = prevPath.join('/') || '/'
    return Util.cleanPath(prevPath)
  }

  static userAgent () {
    // http://stackoverflow.com/a/9851769/3605190
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined'
    // At least Safari 3+: "[object HTMLElementConstructor]"
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia
    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore
    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS

    let ua = ''
    if (isOpera) ua = 'opera'
    if (isFirefox) ua = 'firefox'
    if (isSafari) ua = 'safari'
    if (isIE) ua = 'ie'
    if (isEdge) ua = 'edge'
    if (isChrome) ua = 'chrome'
    return ua
  }
}
