<template>

    <div class="daily">
        <div class="daily-menu">
            <div class="daily-menu-item" :class="{on:type === 'recommend'}"
             @click="handleToRecommend">每日推荐</div>
            <div class="daily-menu-item" :class="{on:type === 'daily'}"
                 @click="showThemes = !showThemes">主题日报</div>
            <ul v-show="showThemes">
                <li v-for="item in themes">
                    <a :class="{on:item.id === themeId && type === 'daily'}"
                    @click="handleToTheme(item.id)">{{item.name}}</a>
                </li>
            </ul>
        </div>


        <div class="daily-list" ref="list" @scroll="handleScroll">
            <template v-if="type === 'recommend' ">
                <div v-for="list in recommendList">
                    <div class="daily-date"> {{ formatDay(list.date) }}</div>
                    <Item v-for="item in list.stories" :data="item" :key="item.id" @click.native="handleClick(item.id)"></Item>
                </div>
            </template>

            <template v-if="type === 'daily' ">
                <Item v-for="item in list" :data="item" :key="item.id" @click.native="handleClick(item.id)"></Item>

            </template>

        </div>

        <daily-article :id="articleId"></daily-article>

    </div>

</template>

<script>

    import $ from './util';
    import Item from './components/item.vue';
    import dailyArticle from './components/daily-article.vue';

    export  default {
        name:'app',
        components: {Item,dailyArticle},
        data(){
            return {
                themes:[],
                showThemes:true,
                type:'recommend',
                themeId:0,
                list:[],//子类文章列表,
                recommendList:[],
                dailyTime:$.getTodayTime(),
                articleId:0,
                isLoading:false,
            }
        },
        methods:{
            getThemes(){
                console.log('获取主题');

                //axios 发起get请求
                $.ajax.get('themes').then(res => {
                    this.themes = res.others;
                    this.showThemes = true;
                    console.log('获取主题返回');


                })

            },
            handleToTheme(id){
                this.type = 'daily';
                this.themeId = id;
                this.list = [];
                $.ajax.get('theme/'+id).then(res =>{
                    this.list = res.stories.filter( item => item.type !== 1);
                });
            },
            getRecommendList(){
                console.log('获取最新消息');

                this.isLoading = true;
                const  prevDay = $.prevDay(this.dailyTime+86400000);
                console.log('prevDay--'+prevDay);
                console.log('this.dailyTime--'+this.dailyTime);
                //最新
                var uri = '/news/latest';
                //获取前一天无效了
                // uri = 'news/before/'+prevDay;
                $.ajax.get(uri).then(res => {
                    // console.log(JSON.stringify(res));
                    this.recommendList.push(res);
                    this.isLoading = false;
                });

            },
            handleToRecommend(){
                this.type = 'recommend';
                this.recommendList = [];
                this.dailyTime = $.getTodayTime();
                this.getRecommendList();
            },
            //格式化日期月日
            formatDay(date){
                let month = date.substr(4,2);
                let day = date.substr(6,2);
                if (month.substr(0,1) === '0') month = month.substr(1,1);
                if (day.substr(0,1) === '0') day = day.substr(1,1);
                return `${month}月${day}日`;
            },
            handleScroll(){
                //获取DOM
                const  $list = this.$refs.list;
                //在 '主题日报'或正在加载推荐列表是停止操作
                if (this.type === 'daily' || this.isLoading)return;

                if ($list.scrollTop+document.body.clientHeight >= $list.scrollHeight){
                    //事件相对减少一天
                    this.dailyTime -= 86400000;
                    this.getRecommendList();
                }
            },
            handleClick(id){
                this.articleId = id;
            }
        },
        mounted(){
            this.getThemes();
            this.getRecommendList();

            /*
            //使用vue提供的scroll事件来改写
            //获取DOM
            const  $list = this.$refs.list;
            //监听滚动事件,注意在beforeDestroy中removeEventListener
            $list.addEventListener('scroll',() => {
                //在 '主题日报'或正在加载推荐列表是停止操作
                if (this.type === 'daily' || this.isLoading)return;

                if ($list.scrollTop+document.body.clientHeight >= $list.scrollHeight){
                    //事件相对减少一天
                    this.dailyTime -= 86400000;
                    this.getRecommendList();
                }

            });
            */
        }
    }

</script>

<style scoped>

    .daily-list {
        width: 300px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 150px;
        overflow: auto;
        border-right: 1px solid #d7dde4;
    }
    .daily-date {
        text-align: center;
        margin: 10px 0;
    }
    .daily-menu ul {
        list-style: none;
    }
    .daily-menu ul li a {

        display: block;
        color: inherit;
        text-decoration: none;
        padding: 5px 0;
        margin: 5px 0;
        cursor: pointer;
    }

    .daily-menu ul li a:hover, .daily-menu ul li a.on{
        color: #3399ff;
    }

</style>