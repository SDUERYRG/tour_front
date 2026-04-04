import willowForestImg from '../assets/images/spots/willow_forest.png'
import birdScienceParkImg from '../assets/images/spots/bird_science_park.png'
import crabCatchingImg from '../assets/images/spots/crab_catching.png'
import lookoutTowerImg from '../assets/images/spots/lookout_tower.png'
import redBeachImg from '../assets/images/spots/red_beach.png'
import birdIslandImg from '../assets/images/spots/bird_island.png'
import whiteCraneLakeImg from '../assets/images/spots/white_crane_lake.png'
import visitorCenterImg from '../assets/images/spots/visitor_center.png'
import birdMuseumImg from '../assets/images/spots/bird_museum.png'
import observationTowerImg from '../assets/images/spots/observation_tower.png'
import northGateImg from '../assets/images/spots/north_gate.png'
import ibisBaseImg from '../assets/images/spots/ibis_base.png'
import storkParkImg from '../assets/images/spots/stork_park.png'

export interface ScenicSpot {
  name: string;
  position: { lng: number; lat: number };
  description: string;
  tag?: string;
  image: string;
}

export const scenicSpots: ScenicSpot[] = [
  { 
    name: '天然柳林', 
    position: { lng: 119.15271553668268, lat: 37.75411180365401 }, 
    description: '郁郁葱葱的天然柳树林，是景区的天然氧吧。',
    tag: '天然氧吧',
    image: willowForestImg
  },
  { 
    name: '鸟类科普园', 
    position: { lng: 119.1675914759279, lat: 37.749254294499 }, 
    description: '这里是观赏和了解黄河口珍稀鸟类的最佳场所。',
    tag: '科普必去',
    image: birdScienceParkImg
  },
  { 
    name: '泥滩捉蟹', 
    position: { lng: 119.196409116688, lat: 37.75701474296271 }, 
    description: '有趣的亲水体验，和家人一起在泥滩上享受捉小螃蟹的乐趣。',
    tag: '亲子互动',
    image: crabCatchingImg
  },
  { 
    name: '远望楼', 
    position: { lng: 119.18074266859398, lat: 37.766771200700056 }, 
    description: '登高远眺，看黄河在此奔流汇入大海，感受豪情壮志。',
    tag: '地标建筑',
    image: lookoutTowerImg
  },
  { 
    name: '红滩湿地', 
    position: { lng: 119.14567282148444, lat: 37.775556607449346 }, 
    description: '独特的翅碱蓬形成壮观的“红色海洋”，是黄河口最动人的色彩。',
    tag: '绝美景观',
    image: redBeachImg
  },
  { 
    name: '鸟岛', 
    position: { lng: 119.05268023509153, lat: 37.770821746286835 }, 
    description: '众多珍稀鸟类在此栖息繁衍，是近距离观鸟的理想之地。',
    tag: '观鸟圣地',
    image: birdIslandImg
  },
  { 
    name: '白鹤湖', 
    position: { lng: 119.0619507479545, lat: 37.770935842922306 }, 
    description: '湖面开阔，水清草美，因常有白鹤出没而得名。',
    tag: '湖光水色',
    image: whiteCraneLakeImg
  },
  { 
    name: '游客中心', 
    position: { lng: 118.99102054488664, lat: 37.7672276113881 }, 
    description: '提供景区咨询、导览、票务等全方位游客服务。',
    tag: '综合服务',
    image: visitorCenterImg
  },
  { 
    name: '鸟类博物馆', 
    position: { lng: 119.00481851751991, lat: 37.76779812075342 }, 
    description: '全国最大的鸟类专题博物馆，展示黄河口丰富的生物多样性。',
    tag: '科普博览',
    image: birdMuseumImg
  },
  { 
    name: '瞭望塔', 
    position: { lng: 119.05720769486182, lat: 37.796489014719995 }, 
    description: '登高望远，俯瞰景区全貌，感受黄河口湿地的壮丽景色。',
    tag: '全景视野',
    image: observationTowerImg
  },
  { 
    name: '北大门', 
    position: { lng: 119.0579263392698, lat: 37.82801892295938 }, 
    description: '景区的北大入口，也是游客进出的主要通道之一。',
    tag: '入口枢纽',
    image: northGateImg
  },
  { 
    name: '朱鹮野化基地', 
    position: { lng: 119.03848700803387, lat: 37.836568998003195 }, 
    description: '致力于朱鹮的野外生存训练与种群恢复，是重要的生态保护基地。',
    tag: '生态保护',
    image: ibisBaseImg
  },
  { 
    name: '白鹳园', 
    position: { lng: 119.00356088980594, lat: 37.813452994687225 }, 
    description: '东方白鹳的乐园，可以近距离观察这些优雅候鸟的栖息环境。',
    tag: '自然奇观',
    image: storkParkImg
  }
];
