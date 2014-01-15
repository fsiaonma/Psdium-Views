var pos1V = G.Container.getClass().extend({
	init:function(){

		this._super(arguments);

		var bg = G.Image.create({slice: G.getSlice('bg')});
		bg.setPos([0, 0, 555, 339]);
		this.addChild(bg);

		var Text_nei_rong = G.Text.create();
		Text_nei_rong.setPos([74, 67, 406, 119]);
		Text_nei_rong.setFontSize(24);
		Text_nei_rong.setWidth(406);
		Text_nei_rong.setLineHeight(48);
		Text_nei_rong.setColor('#FFFFFF');
		Text_nei_rong.setTextAlign('center');
		Text_nei_rong.setText('这里是文字文字文字文字文字字文字文字字文字文字字文字文字字文字文字字文字文字字文字文字字文字文字字');
		this.addChild(Text_nei_rong);

		var Button_qu_xiao = G.Button.create({
			imgUp: G.getSlice('quxiao_up'),
			imgDown: G.getSlice('quxiao_down')
		});
		Button_qu_xiao.setPos([295, 213, 216, 92]);
		this.addChild(Button_qu_xiao);

		var Button_que_ding = G.Button.create({
			imgUp: G.getSlice('queding_up'),
			imgDown: G.getSlice('queding_down')
		});
		Button_que_ding.setPos([44, 213, 216, 92]);
		this.addChild(Button_que_ding);

		var Container_tt = G.Container.create();
		Container_tt.setPos([169, 167, 216, 92]);
		this.addChild(Container_tt);

		var Button_que_ding2 = G.Button.create({
			imgUp: G.getSlice('queding_up'),
			imgDown: G.getSlice('queding_down')
		});
		Button_que_ding2.setPos([0, 0, 216, 92]);
		Container_tt.addChild(Button_que_ding2);

	}
});
