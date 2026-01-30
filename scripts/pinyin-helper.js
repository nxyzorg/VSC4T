/**
 * 汉字转拼音首字母 Helper
 * 使用常用汉字 Unicode 映射 + 区间备用方案
 */

'use strict';

// 常用标签/分类汉字首字母映射（使用 Unicode 转义避免编码问题）
// 只存储每个字母最常见的起始汉字
const COMMON_CHARS = {
  '\u4EE3': 'D', // 代
  '\u53BB': 'Q', // 去
  '\u56FE': 'T', // 图
  '\u56FE': 'T', // 图
  '\u5B89': 'A', // 安
  '\u5B9D': 'B', // 宝
  '\u622A': 'J', // 截
  '\u6C34': 'S', // 水
  '\u7535': 'D', // 电
  '\u5370': 'Y', // 印
  '\u5904': 'C', // 处
  '\u7406': 'L', // 理
  '\u5854': 'T', // 塔
  '\u677F': 'B', // 板
  '\u7247': 'P', // 片
  '\u7A97': 'C', // 窗
  '\u53E3': 'K', // 口
  '\u5361': 'K', // 卡
  '\u5178': 'D', // 典
  '\u7F51': 'W', // 网
  '\u9875': 'Y', // 页
  '\u7AD9': 'Z', // 站
  '\u535A': 'B', // 博
  '\u5BA2': 'K', // 客
  '\u6587': 'W', // 文
  '\u7AE0': 'Z', // 章
  '\u4E3B': 'Z', // 主
  '\u9898': 'T', // 题
  '\u6280': 'J', // 技
  '\u672F': 'S', // 术
  '\u7F16': 'B', // 编
  '\u7801': 'M', // 码
  '\u7A0B': 'C', // 程
  '\u5E8F': 'X', // 序
  '\u8BBE': 'S', // 设
  '\u8BA1': 'J', // 计
  '\u5F00': 'K', // 开
  '\u53D1': 'F', // 发
  '\u6D4B': 'C', // 测
  '\u8BD5': 'S', // 试
  '\u5B66': 'X', // 学
  '\u4E60': 'X', // 习
  '\u6559': 'J', // 教
  '\u7A0B': 'C', // 程
  '\u5DE5': 'G', // 工
  '\u5177': 'J', // 具
  '\u8F6F': 'R', // 软
  '\u4EF6': 'J', // 件
  '\u786C': 'Y', // 硬
  '\u7CFB': 'X', // 系
  '\u7EDF': 'T', // 统
  '\u670D': 'F', // 服
  '\u52A1': 'W', // 务
  '\u5668': 'Q', // 器
  '\u6570': 'S', // 数
  '\u636E': 'J', // 据
  '\u5E93': 'K', // 库
  '\u524D': 'Q', // 前
  '\u7AEF': 'D', // 端
  '\u540E': 'H', // 后
  '\u7F51': 'W', // 网
  '\u7EDC': 'L', // 络
  '\u5B89': 'A', // 安
  '\u5168': 'Q', // 全
  '\u4E91': 'Y', // 云
  '\u8BA1': 'J', // 计
  '\u7B97': 'S', // 算
  '\u667A': 'Z', // 智
  '\u80FD': 'N', // 能
  '\u673A': 'J', // 机
  '\u5668': 'Q', // 器
  '\u6DF1': 'S', // 深
  '\u5EA6': 'D', // 度
  '\u795E': 'S', // 神
  '\u7ECF': 'J', // 经
  '\u7F51': 'W', // 网
  '\u7EFC': 'Z', // 综
  '\u5408': 'H', // 合
  '\u6E38': 'Y', // 游
  '\u620F': 'X', // 戏
  '\u89C6': 'S', // 视
  '\u9891': 'P', // 频
  '\u97F3': 'Y', // 音
  '\u4E50': 'Y', // 乐 (音乐)
  '\u7535': 'D', // 电
  '\u5F71': 'Y', // 影
  '\u751F': 'S', // 生
  '\u6D3B': 'H', // 活
  '\u5065': 'J', // 健
  '\u5EB7': 'K', // 康
  '\u8FD0': 'Y', // 运
  '\u52A8': 'D', // 动
  '\u65C5': 'L', // 旅
  '\u884C': 'X', // 行
  '\u7F8E': 'M', // 美
  '\u98DF': 'S', // 食
  '\u8D2D': 'G', // 购
  '\u7269': 'W', // 物
  '\u8D22': 'C', // 财
  '\u7ECF': 'J', // 经
  '\u60C5': 'Q', // 情
  '\u611F': 'G', // 感
  '\u793E': 'S', // 社
  '\u4EA4': 'J', // 交
  '\u65B0': 'X', // 新
  '\u95FB': 'W', // 闻
  '\u5A31': 'Y', // 娱
  '\u8BA8': 'T', // 讨
  '\u8BBA': 'L', // 论
  '\u5206': 'F', // 分
  '\u4EAB': 'X', // 享
  '\u6536': 'S', // 收
  '\u85CF': 'C', // 藏
  '\u4E0B': 'X', // 下
  '\u8F7D': 'Z', // 载
  '\u4E0A': 'S', // 上
  '\u4F20': 'C', // 传
  '\u5B98': 'G', // 官
  '\u65B9': 'F', // 方
  '\u4F01': 'Q', // 企
  '\u4E1A': 'Y', // 业
  '\u4EA7': 'C', // 产
  '\u54C1': 'P', // 品
};

/**
 * 获取单个汉字的拼音首字母
 */
function getFirstLetter(char) {
  const code = char.charCodeAt(0);
  
  // 非 CJK 统一汉字范围
  if (code < 0x4E00 || code > 0x9FFF) {
    const upper = char.toUpperCase();
    return /^[A-Z]$/.test(upper) ? upper : '#';
  }
  
  // 优先查找常用字映射
  if (COMMON_CHARS[char]) {
    return COMMON_CHARS[char];
  }
  
  // 使用 Unicode 区间近似判断（基于 CJK 统一汉字排列规律）
  // 按照从高到低的顺序判断
  if (code >= 0x9EA0) return 'Z';
  if (code >= 0x9E3F) return 'Y'; 
  if (code >= 0x9C7C) return 'X';
  if (code >= 0x9876) return 'W';
  if (code >= 0x96E8) return 'Y';
  if (code >= 0x9274) return 'X';
  if (code >= 0x8FBE) return 'W';
  if (code >= 0x8D2F) return 'T';
  if (code >= 0x8BA8) return 'S';
  if (code >= 0x88C5) return 'R';
  if (code >= 0x8721) return 'Q';
  if (code >= 0x8303) return 'P';
  if (code >= 0x80A1) return 'N';
  if (code >= 0x7EDF) return 'M';
  if (code >= 0x7B14) return 'L';
  if (code >= 0x77EE) return 'K';
  if (code >= 0x7231) return 'J';
  if (code >= 0x6C49) return 'H';
  if (code >= 0x6784) return 'G';
  if (code >= 0x626F) return 'F';
  if (code >= 0x6076) return 'E';
  if (code >= 0x5927) return 'D';
  if (code >= 0x54C8) return 'C';
  if (code >= 0x5175) return 'B';
  
  return 'A';
}

/**
 * 获取字符串首字符的拼音首字母
 * @param {string} str - 输入字符串
 * @returns {string} - 拼音首字母（大写）
 */
function getPinyinFirstLetter(str) {
  if (!str || str.length === 0) {
    return '#';
  }
  
  const firstChar = str.charAt(0);
  
  // 如果是英文字母，直接返回大写
  if (/^[A-Za-z]$/.test(firstChar)) {
    return firstChar.toUpperCase();
  }
  
  // 如果是数字，归类到 #
  if (/^[0-9]$/.test(firstChar)) {
    return '#';
  }
  
  // 如果是中文，获取拼音首字母
  const code = firstChar.charCodeAt(0);
  if (code >= 0x4E00 && code <= 0x9FA5) {
    return getFirstLetter(firstChar);
  }
  
  return '#';
}

// 注册 Hexo Helper
hexo.extend.helper.register('getPinyinFirstLetter', function(str) {
  return getPinyinFirstLetter(str);
});

// 导出函数供其他脚本使用
module.exports = {
  getPinyinFirstLetter,
  getFirstLetter
};
