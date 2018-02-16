{
  let view = {
    el: '.page > main',
    init(){
      this.$el = $(this.el)
    },
    template: `
      <form class="form">
        <div class="row">
          <label>
          歌名
          </label>
          <input name="name" type="text" value="__name__">
        </div>
        <div class="row">
          <label>
          歌手
          </label>
          <input name="singer" type="text" value="__singer__">
        </div>
        <div class="row">
          <label>
          外链
          </label>
          <input name="url" type="text" value="__url__">
        </div>
        <div class="row actions">
          <button type="submit">保存</button>
        </div>
      </form>
    `,
    render(data = {}){
      let placeholders = ['name', 'url', 'singer', 'id']
      let html = this.template
      placeholders.map((string)=>{
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
      if(data.id){
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      }else{
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    },
    reset(){
      this.render({})
    }
  }
  let model = {
    data: {
      name: '', singer: '', url: '', id: ''
    },
    create(data){
      var Song = AV.Object.extend('Song');
      var song = new Song();
      song.set('name',data.name);
      song.set('singer',data.singer);
      song.set('url',data.url);
      return song.save().then((newSong) =>{
        let {id, attributes} = newSong
        Object.assign(this.data, { id, ...attributes })
      }, (error) =>{
        console.error(error);
      });    
    }
  }
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('select', (data)=>{
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', (data)=>{
        if(this.model.data.id){
          this.model.data = {
            name: '', url: '', id: '', singer: ''
          }
        }else{
          Object.assign(this.model.data, data)
        }
        this.view.render(this.model.data)
      })
    },
    bindEvents(){
      this.view.$el.on('submit', 'form', (e)=>{
        e.preventDefault()
        let needs = 'name singer url'.split(' ')
        let data = {}
        needs.map((string)=>{
          data[string] = this.view.$el.find(`[name="${string}"]`).val()
        })
        this.model.create(data)
          .then(()=>{
            this.view.reset()
            //this.model.data === 'ADDR 108'
            let string = JSON.stringify(this.model.data)
            let object = JSON.parse(string)
            window.eventHub.emit('create', object)
          })
      })
    }
  }
  controller.init(view, model)

}
