(function() {
	// header
	const header = {
		elm: document.querySelector('#header'),
		theme: '',
		sliderEvent: function(slider) {
			// 슬라이더 init, change 이벤트에 따른 액션
			const t = this;

			let activeSlider = slider.slides[ slider.activeIndex ];
			let getHeaderTheme = activeSlider.dataset.headerTheme;

			t.theme = getHeaderTheme;

			if ( ! t.elm.classList.contains('fixed') ) {
				t.elm.removeAttribute('class');
				t.elm.classList.add(t.theme);
			}
		},
		scrollEvent: function() {
			// 스크롤 위치에 따라 header class 추가
			const t = this;

			if ( window.scrollY > 100 ) {
				t.elm.classList.add('fixed');
			} else {
				t.elm.removeAttribute('class');
				if ( t.theme != '' ) {
					t.elm.classList.add(t.theme);
				}
			}
		},
		anchor: function(target) {
			// gnb 메뉴 클릭 시 anchor 이동
			target = target.replace('#', '#sec-');
			$('html, body').animate({
				scrollTop: $(target).offset().top
			}, 500);
		}
	}

	// header scroll
	header.scrollEvent();
	window.addEventListener('scroll', function(e) {
		header.scrollEvent();
	});

	// header navigation
	$('#header .nav a').on('click', function(e) {
		e.preventDefault();
		const target = $(this).attr('href');
		header.anchor(target);
	});


	// section - slider
	const progress_bar = document.querySelector('.progress-bar');
	const sec01_slider = new Swiper('.sec-slider .swiper-container', {
		loop: true,
		slidesPerView: 1,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		// autoplay: {
		// 	delay: 1000
		// },
		on: {
			init: function(swiper) {
				header.sliderEvent(swiper);
			},
			slideChange: function(swiper) {
				header.sliderEvent(swiper);
			}
		}
	});

	// section - project
	const sec02_project_action = function(slider) {
		const zoomIn = document.querySelector('.sec-project .zoom-in');

		let activeSlider = slider.slides[ slider.activeIndex ];
		let data = JSON.parse( activeSlider.dataset.set );
		let title = data.title;
		let desc = data.desc;
		let url = data.url;
		let image = getComputedStyle(activeSlider).backgroundImage;
		// 이미지 경로만 남아야 할 경우 slice를 사용해 불필요한 문자열 제거
		// image = image.slice(5, -2)

		// zoom-in 엘리먼트에 변경될 값 적용
		zoomIn.querySelector('.title').innerHTML = title;
		zoomIn.querySelector('.desc').innerHTML = desc;
		zoomIn.querySelector('.external').setAttribute('href', url);
		zoomIn.style.backgroundImage = getComputedStyle(activeSlider).backgroundImage;
	}

	const sec02_project_slider = new Swiper('.sec-project .slider-area .swiper-container', {
		loop: true,
		slidesPerView: 1,
		loopAdditionalSlides: 6,
		spaceBetween: 15,
		// allowTouchMove: false,
		// slideToClickedSlide: true,
		// grabCursor: true,
		navigation: {
			prevEl: '.sec-project .slider-navigation .prev',
			nextEl: '.sec-project .slider-navigation .next',
		},
		on: {
			init: function(swiper) {
				sec02_project_action(swiper);
			},
			slideChange: function(swiper) {
				sec02_project_action(swiper);
			},
			click: function(swiper, event) {
				let index = parseInt( event.target.dataset.swiperSlideIndex );
				swiper.slideToLoop(index);
			}
		}
	});

	// section - team
	function tab(container) {
		this.container  = document.querySelector(container);
		this.navigation = this.container.querySelector('.tab-navigation');
		this.wrapper    = this.container.querySelector('.tab-wrapper');

		this.navAction = function(p) {
			let btns = p.navigation.querySelectorAll('a');
			btns.forEach(function(elm, idx) {
				elm.addEventListener('click', function(e) {
					e.preventDefault();
					let target = elm.getAttribute('href');
						target = target.replace('#', '');
					let parent = elm.parentNode;

					if ( ! parent.classList.contains('active') ) {
						parent.parentNode.querySelector('.active').classList.remove('active');
						parent.classList.add('active');

						p.wrapper.querySelector('[data-tab-id].active').classList.remove('active');
						p.wrapper.querySelector('[data-tab-id="'+target+'"]').classList.add('active');
					}
				})
			});
		}

		this.run = function() {
			this.navAction(this);
		};

		return this.run();
	}

	const tabs = new tab('.tab-container');

	$('[data-user]').each(function(idx, elm) {
		let t       = $(elm);
		let results = t.data().user.results;
		let gender  = t.data().user.gender;
		let lists   = t.find('.lists');
		let position;

		$.ajax({
			url: 'https://randomuser.me/api/',
			dataType: 'json',
			data: {
				'results': results,
				'gender' : gender ? gender : '',
			},
			success: function(data) {
				let item = '';

				for ( let i = 0; i < data.results.length; i++ ) {
					let output = data.results[i];
					let rank;

					switch (idx) {
						case 0:
							position = 'Designer';

							switch (i) {
								case 0: rank = 'Lead '; break;
								case 1: rank = 'Senior '; break;
								case 2: rank = 'Junior '; break;
							}

							break;

						case 1:
							position = 'Developer';

							switch (i) {
								case 0: rank = 'Senior '; break;
								case 1: rank = 'Junior '; break;
							}

							break;

						case 2:
							position = 'Developer';
							rank = 'Front-end ';
							break;
					}

					item += '<li>';
					item += '	<div class="user">';
					item += '		<div class="user-thumb" style="background-image: url(\'' + output.picture.large + '\');"></div>';
					item += '		<div class="user-name">';
					item += '			<div class="name">' + output.name.last + ' ' + output.name.first + '</div>';
					item += '			<div class="position">' + rank + position + '</div>';
					item += '		</div>';
					item += '		<div class="user-actions">';
					item += '			<a class="action email" href="mailto:' + output.email + '"><i class="far fa-envelope"></i></a>';
					item += '			<a class="action phone" href="tel:' + output.phone + '"><i class="fas fa-phone"></i></a>';
					item += '			<a class="action gender" href="javascript:void(0);">';
					// if ( output.gender == 'female' ) {
					// 	item += '				<i class="fas fa-venus"></i>';
					// } else {
					// 	item += '				<i class="fas fa-mars"></i>';
					// }
					item += '				<i class="fas fa-' + ( output.gender == 'female' ? 'venus' : 'mars' ) + '"></i>';
					item += '			</a>';
					item += '		</div>';
					item += '	</div>';
					item += '</li>';

				}

				lists.append(item);
			}
		});
	})
})();
