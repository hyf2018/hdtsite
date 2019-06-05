(function() {
	$.fn.scrollPagination = function(options) {
		var settings = { 
			nop     : 10, // 初始加载的条数
			offset  : 0, // 分页起始值
			error   : '没有了!', 
			delay   : 500, 
			scroll  : true // 是否自动加载
		}
		if(options) {
			$.extend(settings, options);
		}
		return this.each(function() {		
			$this = $(this);
			$settings = settings;
			var offset = $settings.offset>=0?$settings.offset:0;
			var busy = false; 
			if($settings.scroll == true) $initmessage = '<span class="ui-loading">更多</span>';
			else $initmessage = '<span class="refresh-down">查看更多</span>';
			$this.append('<div class="news-more nomore">'+$initmessage+'</div>');
			function getData() {
				$.post(app_path+'/data/news.js', {
					action        : 'scrollpagination',
				    number        : $settings.nop,
				    offset        : offset
				}, function(data) {
					$this.find('.news-more').html($initmessage);
					var number = $settings.nop>=1?$settings.nop:1;
					var rest = '';
					//从文件取值
					var jsonObj =  JSON.parse(data);//转换为json对象
					var start = number * offset;
					var end = (offset+1) * number-1;
					if(start<=jsonObj.length-1){
						for(var i=start;i<=end;i++){
							var news = jsonObj[i];
							if(news){
								rest += '<div class="news-item">'
								rest += '<div class="news-list">'
								rest += '<p class="news-item-title"><a href="news-'+news.id+'.html">'+news.title+'</a></p>'
								rest += '<p class="news-item-desc">'+news.desc+'</p></div></div>'
							}
						}	

					}

					if(rest == "") { 
						$this.find('.news-more').html($settings.error);	
						setTimeout(function(){
							$this.find('.news-more').hide(2500);
						},2000);
					}
					else {
						// offset = offset+$settings.nop; 
						offset++;
					   	$this.find('#main').append(rest);
						busy = false;
					}
				});
			}
			getData(); 
			if($settings.scroll == true) {
				$(window).scroll(function() {
					if($(window).scrollTop() + $(window).height() > $this.height() && !busy) {
						busy = true;
						$this.find('.news-more').html('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
						setTimeout(function() {
							getData();
							
						}, $settings.delay);
							
					}	
				});
			}
			$this.find('.news-more').click(function() {
				if(busy == false) {
					busy = true;
					getData();
				}
			});
		});
	}
})();
