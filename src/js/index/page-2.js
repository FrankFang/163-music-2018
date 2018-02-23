{
  let view = {
    el: '.page-2',
    init(){
      this.$el = $(this.el)
    },
    show(){
      console.log('here')
      this.$el.addClass('active')
    },
    hide(){
      this.$el.removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view, model){
      this.view = view 
      this.view.init()
      this.model = model
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('selectTab', (tabName)=>{
        console.log('1')
        console.log(tabName)
        if(tabName === 'page-2'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    }

  }
  controller.init(view, model)
}
