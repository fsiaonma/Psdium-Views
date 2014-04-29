var pos2V = G.Container.getClass().extend({
	init:function(){

		this._super(arguments);

		var demoBg = G.Image.create({slice: G.getSlice('demoBg')});
		demoBg.setVisible(true);
		demoBg.setPos([0,0,960,576]);
		this.addChild(demoBg);
		this.demoBg = demoBg;

		var chatbg = G.Image.create({slice: G.getSlice('chatbg')});
		chatbg.setVisible(true);
		chatbg.setPos([114,29,729,523]);
		this.addChild(chatbg);
		this.chatbg = chatbg;

		var input = G.Image.create({slice: G.getSlice('input')});
		input.setVisible(true);
		input.setPos([139,50,490,68]);
		this.addChild(input);
		this.input = input;

		var changyongyuitem = new Changyongyuitem();

		var changyongyuContainer = G.Container.create();
		var changyongyu = G.DragPanel.create();
		changyongyu.setWidth(629);
		changyongyu.setHeight(292);
		changyongyu.setVisible(true);
		changyongyu.setPos([164,229,629,292]);
		changyongyu.setContent(changyongyuContainer);
		this.addChild(changyongyu);
		changyongyuContainer.addChild(changyongyuitem);
		this.changyongyu = changyongyu;
		this.changyongyuContainer = changyongyuContainer;
		this.changyongyuitem = changyongyuitem;

		var juhua = G.Animation.create({
			actions: [
				G.Action.create({slice: G.getSlice('juhua1')}),
				G.Action.create({slice: G.getSlice('juhua2')}),
				G.Action.create({slice: G.getSlice('juhua3')}),
				G.Action.create({slice: G.getSlice('juhua4')}),
				G.Action.create({slice: G.getSlice('juhua5')}),
				G.Action.create({slice: G.getSlice('juhua6')}),
				G.Action.create({slice: G.getSlice('juhua7')}),
				G.Action.create({slice: G.getSlice('juhua8')}),
				G.Action.create({slice: G.getSlice('juhua9')}),
				G.Action.create({slice: G.getSlice('juhu10')}),
				G.Action.create({slice: G.getSlice('juhua11')}),
				G.Action.create({slice: G.getSlice('juhua12')})
			]
		});
		juhua.setVisible(true);
		juhua.setPos([594,147,49,49]);
		this.addChild(juhua);
		this.juhua = juhua;

		var biaoqing = G.ToggleButton.create({
			imgUp: G.getSlice('bqup'),
			imgDown: G.getSlice('bqdown'),
			checkedImgUp: G.getSlice('bqdown'),
			checkedImgDown: G.getSlice('bqdown')
		});
		biaoqing.setVisible(true);
		biaoqing.setPos([376,137,202,77]);
		this.addChild(biaoqing);
		this.biaoqing = biaoqing;

		var changyongyu = G.ToggleButton.create({
			imgUp: G.getSlice('cyyup'),
			imgDown: G.getSlice('cyydown'),
			checkedImgUp: G.getSlice('cyydown'),
			checkedImgDown: G.getSlice('cyydown')
		});
		changyongyu.setVisible(true);
		changyongyu.setPos([158,137,202,77]);
		this.addChild(changyongyu);
		this.changyongyu = changyongyu;

		var close = G.Button.create({
			imgUp: G.getSlice('closeup'),
			imgDown: G.getSlice('closedown')
		});
		close.setVisible(true);
		close.setPos([778,18,152,112]);
		this.addChild(close);
		this.close = close;

		var chatContainer = G.Container.create();
		chatContainer.setPos([149,62,467,44]);
		this.addChild(chatContainer);
		var chat = G.Input.create();
		chat.setWidth(467);
		chat.setHeight(44);
		chat.setLineHeight(39);
		chat.setFontSize(28);
		chat.setVisible(true);
		chatContainer.addChild(chat);
		this.chat = chat;
		this.chatContainer = chatContainer;

		var fasong = G.Button.create({
			imgUp: G.getSlice('fsup'),
			imgDown: G.getSlice('fsdown')
		});
		fasong.setVisible(true);
		fasong.setPos([629,48,172,77]);
		this.addChild(fasong);
		this.fasong = fasong;

		var kg = G.Switch.create({
			width: 164,
			bg: G.getSlice('kgbg'),
			upBar: G.getSlice('kgup'),
			downBar: G.getSlice('kgdown')
		});
		kg.setVisible(true);
		kg.setPos([646,138,164,77]);
		this.addChild(kg);
		this.kg = kg;

	}
});
