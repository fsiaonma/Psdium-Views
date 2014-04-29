var ChangyongyuitemV = G.Container.getClass().extend({
	init:function(){

		this._super(arguments);

		var xian = G.Image.create({slice: G.getSlice('xian')});
		xian.setVisible(true);
		xian.setPos([164,291,628,6]);
		this.addChild(xian);
		this.xian = xian;

		var xuanzhong = G.Image.create({slice: G.getSlice('xuanzhong')});
		xuanzhong.setVisible(true);
		xuanzhong.setPos([162,231,625,59]);
		this.addChild(xuanzhong);
		this.xuanzhong = xuanzhong;

		var changyongyutext = G.Text.create();
		changyongyutext.setPos([196,246,346,28]);
		changyongyutext.setFontSize(28);
		changyongyutext.setWidth(346);
		changyongyutext.setLineHeight(39);
		changyongyutext.setColor('#643814');
		changyongyutext.setTextAlign('left');
		changyongyutext.setText('快点吧，我等到花儿也谢了！');
		changyongyutext.setVisible(true);
		this.addChild(changyongyutext);
		this.changyongyutext = changyongyutext;

	}
});
