(function () {
	function DropDown ( optn ) {
		optn.handle.dropdown = this;
		$.extend( this, this.defaultSetting, optn );
		this.init();
	} 
	DropDown.prototype = {
		defaultSetting : {
			handle : '',
			triggleType : 'hover',
			listSelector : function(){},
			itemSelector : '',
			createItem : function(){},
			data : {},
			listData : []
			 /** ec
				init : dropdownInstance
				pick : itemData, handleData
				show : dropdownInstance
			 */
		},
		init : function  (  ) {
			var self = this;
			var $handle = $(this.handle);
			this.ec = uxe.Emitter();
			this.on = function  ( type, handle ) {
				self.ec.on ( type, handle );
				return self;
			};
			this.list = List({
				selector : function  (  ) {
					return self.listSelector( $handle, self );
				},
				itemSelector : this.itemSelector,
				createItem : this.createItem
			});
			
			if ( this.triggleType === 'hover' ) {
				this.list.getContainer().on('mouseleave',function  ( e ) {
					if ( $(e.relatedTarget).not( $handle ) ) {
						self.hide();
					}
				});
				$handle.on('mouseenter', function  ( e ) {
					self.show();
				});
				$handle.on('mouseleave',function  ( e ) {
					var $related = $(e.relatedTarget);
					var $listContainer = self.list.getContainer();
					if ( $related.not( $listContainer )&& !_.contains( $related.parents(), $listContainer[0] ) ) {
						self.hide();
					}
				});
			} else if ( this.triggleType === 'click' ) {
				$handle.on('click', function  ( e ) {
					self.show();
				});
			}
			this.list.on('click',this.itemSelector,function  ( e, data ) {
				self.ec.fire('pick', data, self.data );
			});
			
			this.ec.fire('inited', this );
		},
		show : function  ( data, listData ) {
			this.ec.fire ( 'show', this );
			if ( data ) {
				this.data = data;
			} else {
				data = this.data;
			}
			if ( listData ) {
				this.listData = listData;
			} else {
				listData = this.listData;
			}
			this.list.getContainer().show();
			this.list.reset ( listData );
		},
		hide : function  (  ) {
			this.ec.fire('hide', this);
			this.list.getContainer().hide();
		}
	};
	window.DropDown = function  ( optn ) {
		// 保持单例
		if ( optn.handle.dropdown ) {
			return optn.handle.dropdown;
		}
		return new DropDown ( optn );
	};
}());