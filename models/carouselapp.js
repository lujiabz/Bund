var keystone = require('keystone'),
    Types = keystone.Field.Types;

var CarouselApp = new keystone.List('CarouselApp', {
    label: '手机轮播图',
    singular: '手机轮播图',
    plural: '手机轮播图',
    map: { name: '图名' },
    defaultSort: '-优先级'
});

CarouselApp.add({
    '图名': { type: String, required: true},
    '文件': { type: Types.LocalFile, dest:'public/upload/', prefix:'/upload',
        format: function(item, file){
            return '<img src="/upload/'+file.filename+'" style="max-width: 300px">'
        },
        filename: function(item, filename) {
            return item._id+require('path').extname(filename);
        }},
    '发布': { type: Types.Boolean, default: 'false' },
    '描述': String,
    '上传时间': { type: Date, default: Date.now, noedit:true},
    '链接': { type: String },
    '网页链接': { type: String, noedit: true},
    '网页': { type: Types.Html, wysiwyg: true, height: 500},
    '优先级': { type: Types.Number, default: '1', required: true},
    '出现统计': { type: Types.Url},
    '点击统计': { type: Types.Url}
});

CarouselApp.defaultColumns = '图名, 发布, 链接30%, 描述, 上传时间, 优先级, 链接';

CarouselApp.schema.pre('save', function(next) {
    this.网页链接 =  'http://www.bundpic.com/mcarousel/'+this._id;
    if (this.isModified('文件')) {
        this.上传时间 = new Date();
    }
    if (this.isModified('链接') || this.isModified('描述') || this.isModified('文件')) {
        var link = ""
        if (this.链接) {
            link = "\"javascript:openonphone('"+this.链接+"');\"";
        }
        this.网页 = "<div><a href="+link+"><div><img src=\"../../upload/"+this.文件.filename+"\"/><div class=\"gradient\" style=\"position:absolute;left:0px;top:0px;width:100%;height:100%;background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(60,60,60,0.5) 100%);\"><h3 class=\"gradient-title\" style=\"margin:30px 0px 30px;padding:0 20px 0;position:absolute;bottom:0px;color:rgb(255,255,255);font-size:18px;font-weight:500;font-family:\"黑体\";\">"+this.描述+"</h3></div></div></a><div>"
    }
    next();
});

//CarouselApp.schema.post('delete', function(next) {
//
//});

CarouselApp.register();