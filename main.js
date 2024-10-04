const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Đặt tên cho local storage key
const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const body = $("body");
const player = $('.player');
const heading = $('header h4');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const progress = $('#progress');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.play-list');
const searchBtn = $('.search-icon');
const searchInput = $('.search-input');
const settingBtn = $('.setting-icon');
const settingBox = $('.setting-box');
const checkbox = $('.input-check-box');
const dashboard = $('.dashboard');
console.log(dashboard)

const data = {
    currentIndex: 0,
    isplaying: false,
    isRandom: false,
    isRepeat: false,
    addInput: false,
    isSetting: false,
    songOgirin: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}, // lưu vào local storage
    song: [
    {
        name: 'Thuỷ triều',
        singer: 'Quang Hùng MasterD',
        path: './assets/music/thuytrieu.mp3',
        img: './assets/img/thuytrieu.jpg',
    },
    {
        name: 'Hoa Cưới',
        singer: 'Đạt Long Vinh',
        path: './assets/music/hoacuoi.mp3',
        img: './assets/img/hoacuoi.jpg',
    },
    {
        name: 'Lệ Hoa',
        singer: 'TLong',
        path: './assets/music/lehoa.mp3',
        img: './assets/img/lehoa.jpg',
    },
    {
        name: 'Giá Như',
        singer: 'No Phước Thịnh',
        path: './assets/music/gianhu.mp3',
        img: './assets/img/gianhu.jpg',
    },
    {
        name: 'Nguyệt Hồng Phai',
        singer: 'Huy TK x NH4T x Pha',
        path: './assets/music/nguyethongphai.mp3',
        img: './assets/img/nguyethongphai.jpg',
    },
    {
        name: 'Lệ Hoa',
        singer: 'TLong',
        path: './assets/music/lehoa.mp3',
        img: './assets/img/lehoa.jpg',
    },
    {
        name: 'Lệ Hoa',
        singer: 'TLong',
        path: './assets/music/lehoa.mp3',
        img: './assets/img/lehoa.jpg',
    },
    {
        name: 'Lệ Hoa',
        singer: 'TLong',
        path: './assets/music/lehoa.mp3',
        img: './assets/img/lehoa.jpg',
    },
    {
        name: 'Lệ Hoa',
        singer: 'TLong',
        path: './assets/music/lehoa.mp3',
        img: './assets/img/lehoa.jpg',
    },
    {
        name: 'Lệ Hoa',
        singer: 'TLong',
        path: './assets/music/lehoa.mp3',
        img: './assets/img/lehoa.jpg',
    },
],
    setConfig: function(key, value) { 
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));  //Lấy từ local storage
    },
    render: function () { 
        const html = this.song.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <div class="thumb"
                        style="background-image: url(${song.img})">
                    </div>
                    <div class="body">
                        <h3 class='title'>${song.name}</h3>
                        <p class='author'>${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = html.join('')
    },

    // Bài hát đầu tiên được khởi chạy mặc định khi bắt đầu
    difineProperties: function () {
        Object.defineProperty(this, 'currentSong', { 
            get: function() {
                return this.song[this.currentIndex];
            }
        })
    },

    // Load bài hát hiện tại lên giao diện
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },

    handleEvent: function() {
        // Lấy chiều rộng (cao) của cd
        const cdWidth = cd.offsetWidth

        const _this = this;

        // Xử lý quay / dừng cd
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'},
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity, // lặp lại vô hạn
        })
        // Lúc đầu vào thì không quay / d

        cdThumbAnimate.pause();
        // Bắt sự kiện kéo -> thu nhỏ cd (không có thằng này thì lấy thằng kia để tính)
        document.onscroll = function() {
           const scrollTop = window.scrollY || document.documentElement.scrollTop;
           const newCdWidth = cdWidth - scrollTop;

           cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 ;
           // Mờ dần khi cd nhỏ lại
           cd.style.opacity = newCdWidth / cdWidth;
        }
        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isplaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Khi song được play
        audio.onplay = function() {
            _this.isplaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isplaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiếng độ bài hát thay đổi - progress chạy
        audio.ontimeupdate = function() {
            // Tính % bài hát
            if(audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercent
            }
        }
        
        // Xử lý tua e trả về vị trí của progress (0 -> 100)
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            console.log(seekTime);
            audio.currentTime = seekTime;
        }

        // Xử lý click next song
        nextBtn.onclick = function() {
            if(_this.isRandom) { 
                _this.randomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lý prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) { 
                _this.randomSong();
            }else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lý repeat song

        // Xử lý ramdom
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            // Nếu = true thì thêm active và false thì xoá active
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                _this.currentTime = 0;
                audio.play();
            } else {
                nextBtn.onclick();
            }
        }

        // Xử lý lặp lại một bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        // Lắng nghe hành vi click vào playlist
        playList.onclick = (e) => {
            const songElement = e.target.closest('.song:not(.active)')
            // closest trả về element chính nó hoạt thẻ cha của nó - ko phải active hoặc là option thì lọt vào
            if (songElement || e.target.closest('.option')) {
                // Xử lý click vào song
                if(songElement) {
                    console.log(songElement.dataset.index)
                    _this.currentIndex = Number(songElement.dataset.index)
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }

                // Xử lý click vào option
                if(e.target.closest('.option')) {

                }
            }
        }

        //Xử lý click vào input
        document.onclick = function(e) {
           var asst = searchInput.contains(e.target); // Kiểm tra sự kiện click có nằm trong input hay ko
            if(!asst && searchInput.value === '') {
                searchInput.value = 'Tìm kiếm';
            }
            else if(asst && searchInput.value === 'Tìm kiếm') { 
                searchInput.value = '';
            }
        }

        // Xử lý search bài hát
        searchBtn.onclick = () => {
            _this.addInput = !_this.addInput
            searchInput.classList.toggle('active', _this.addInput);
            if(searchInput.classList.contains('active')) {
                playList.style.marginTop = '414px' //Khi hiện thanh tìm kiếm
            }
            else {
                playList.style.marginTop = '389px' //Khi ẩn thanh tìm kiếm
            }
        }
        // search bài hát
        searchInput.oninput = (e) => {
            const searchValue = e.target.value.trim().toLowerCase();
            console.log(searchValue);
            if(searchValue.length > 0) {
                const songs = this.song.filter(song =>
                song.name.includes(searchValue)
            )
                this.song = songs
                this.render()
            } else {
                this.song = this.songOgirin
                this.render()
            }
        }

        // Xử lý setting
        settingBtn.onclick = (e) => {
            _this.isSetting = !_this.isSetting
            settingBox.classList.toggle('active', _this.isSetting)
        }

        // Xử lý checkbox
        checkbox.onclick = (e) => {
            if(e.target.checked) {
                body.classList.add('dark-mode');
                dashboard.style.backgroundColor = "#000";
                playList.style.backgroundColor = "#000";
            }
            else {
                dashboard.style.backgroundColor = "#fff";
                playList.style.backgroundColor = "#fff";
                body.classList.remove('dark-mode');
            }
        }
    },

    loadConfig: function () { 
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() { 
        this.currentIndex++;
        if(this.currentIndex >= this.song.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.song.length -1;
        }
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        let indexOld = [];
        do {
            newIndex = Math.floor(Math.random() * this.song.length)
        } while (newIndex === this.currentIndex) // Trùng với index hiện tại thì mới lặp
        
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function() { 
        setTimeout(() => { 
            $('.song.active').scrollIntoView({
                behavior:'smooth', // Hành vi - kéo nhẹ nhàng :3
                block: 'center', // Kéo đến (phạm vi có thể nhìn được), kéo vào giữa
            }) 
        }, 300)
    },

    searchSong: function() { 
        
    },

    start: function () {
        this.songOgirin = [...this.song]
        this.render(this.songOgirin)
        // Gán cấu hình từ config từ ứng dụng 
        this.loadConfig();
        this.render();
        this.difineProperties();
        this.handleEvent()
        this.loadCurrentSong();
        // Hiểm thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },
}

data.start()