let boardMap = [];
const default_map = [
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":19173961,"14":0,"15":0,"16":153391688,"17":0}',
];

const chobocho_map = [
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":75497472,"17":603979776}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":6,"16":54,"17":48}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":306708480,"14":0,"15":0,"16":0,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":24576,"13":0,"14":0,"15":0,"16":0,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":24,"11":24,"12":216,"13":0,"14":0,"15":0,"16":0,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":4681,"13":672661056,"14":672403008,"15":767032896,"16":672628801,"17":672661065}',
];

const mapString= [
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":76546048,"9":67108864,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":4793488,"12":8192,"13":8192,"14":4793488,"15":8192,"16":8192,"17":4793488}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1794048,"10":1826816,"11":1794048,"12":98304,"13":98304,"14":50430144,"15":6391296,"16":7190016,"17":38646928}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":16777152,"10":16777152,"11":4032,"12":4032,"13":4032,"14":4032,"15":16777152,"16":16777152,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":16777152,"10":14680512,"11":14680512,"12":2097088,"13":2097088,"14":14680512,"15":14680512,"16":16777152,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":2096640,"9":16777208,"10":134217727,"11":4095,"12":4095,"13":4095,"14":4095,"15":2097151,"16":16777215,"17":134217720}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":14159232,"10":115043760,"11":115043760,"12":115043760,"13":115043760,"14":115043760,"15":14380416,"16":1797120,"17":221184}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":786432,"9":98304,"10":14269824,"11":115043760,"12":115043760,"13":115043760,"14":117140912,"15":117140912,"16":14642560,"17":1797120}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":38347920,"10":38347920,"11":38347920,"12":38347920,"13":38347920,"14":38338560,"15":38338560,"16":38338560,"17":38338560}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":18720,"10":18720,"11":18720,"12":18720,"13":18720,"14":76695840,"15":76695840,"16":76695840,"17":76695840}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":57521880,"10":57521880,"11":57521880,"12":57409536,"13":57521880,"14":57521880,"15":1752,"16":57521880,"17":57521880}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":95869800,"10":95869800,"11":94372200,"12":94372200,"13":94372200,"14":94372200,"15":94372200,"16":95869800,"17":95869800}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":113246640,"10":113246640,"11":113246640,"12":115043760,"13":115043760,"14":113246640,"15":113246640,"16":115043760,"17":115043760}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1198080,"10":1198080,"11":1198080,"12":1198080,"13":9586944,"14":76695840,"15":76548384,"16":612368676,"17":612368676}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":1797120,"10":14380416,"11":114822576,"12":113246640,"13":113246640,"14":113246640,"15":114822576,"16":14380416,"17":1797120}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":38347920,"10":38347920,"11":38347920,"12":599040,"13":599040,"14":4793472,"15":38274192,"16":306709650,"17":306184338}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":1198080,"8":1198080,"9":0,"10":76695840,"11":76695840,"12":76695840,"13":1198080,"14":9586944,"15":76548384,"16":613419300,"17":612368676}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":57521880,"11":57521880,"12":57409536,"13":57521856,"14":57521856,"15":57409536,"16":57507840,"17":7188480}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":134217720,"11":134217720,"12":4088,"13":134217720,"14":134217720,"15":4088,"16":134217720,"17":134217720}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":95869800,"11":95869800,"12":11799360,"13":11799360,"14":11799360,"15":11799360,"16":95869800,"17":95869800}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":599040,"8":599040,"9":0,"10":38347920,"11":38347920,"12":0,"13":4793472,"14":38347920,"15":37748880,"16":38347920,"17":4793472}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":113246208,"8":113248256,"9":113264896,"10":113396000,"11":114425892,"12":114425892,"13":114444580,"14":114444292,"15":114444292,"16":114444292,"17":114444292}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":7191232,"9":61724376,"10":91601752,"11":58054360,"12":7722688,"13":1497600,"14":184320,"15":184320,"16":1497600,"17":11983680}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":50331672,"8":58719960,"9":16777152,"10":134217720,"11":132379128,"12":132379128,"13":16777152,"14":2096640,"15":132379128,"16":132121080,"17":117440568}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":6291648,"8":7079616,"9":787968,"10":1497600,"11":11983680,"12":95869800,"13":95081832,"14":95081832,"15":95081832,"16":11983680,"17":1497600}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":98304,"8":6402048,"9":6303936,"10":7091904,"11":7188672,"12":100032,"13":7177728,"14":898560,"15":110592,"16":110592,"17":7190208}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":1797120,"9":14642560,"10":115338672,"11":115043760,"12":115305904,"13":117403056,"14":14380416,"15":1497600,"16":1497600,"17":184320}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":2096640,"9":16777152,"10":132121080,"11":132121080,"12":14680512,"13":2096640,"14":258048,"15":16773120,"16":16773120,"17":258048}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":73728,"11":566272,"12":562176,"13":73728,"14":37748808,"15":306709065,"16":289931336,"17":35651584}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":36864,"8":299520,"9":2396736,"10":4169280,"11":3997248,"12":2396736,"13":2396736,"14":18907208,"15":18911304,"16":136351809,"17":2101312}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":1073479680,"8":1073709056,"9":134148096,"10":16702976,"11":2087872,"12":134216696,"13":16776704,"14":2097088,"15":262136,"16":32767,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":599040,"8":599040,"9":73728,"10":599040,"11":4493952,"12":35951184,"13":35951184,"14":35951184,"15":35951184,"16":4493952,"17":599040}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":306783232,"12":306783232,"13":0,"14":0,"15":0,"16":599186,"17":599186}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":16519104,"11":16519104,"12":16519104,"13":16519104,"14":16519104,"15":16519104,"16":16519104,"17":16519104}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":11960320,"12":1495040,"13":186880,"14":23360,"15":2920,"16":365,"17":45}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":4489216,"10":35950592,"11":287908864,"12":155751424,"13":155451904,"14":155451392,"15":287870976,"16":304423488,"17":306521225}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":4,"10":4,"11":4,"12":4,"13":4,"14":4,"15":4,"16":4,"17":4}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":134217720,"10":16777152,"11":2096640,"12":258048,"13":0,"14":0,"15":0,"16":0,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":6291648,"15":51119640,"16":0,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":184320,"13":85199400,"14":10486080,"15":85199400,"16":0,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":939524101,"9":1056964653,"10":132120936,"11":16517952,"12":2087424,"13":249856,"14":1506816,"15":11800512,"16":94372344,"17":754974783}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":7190232,"12":6291480,"13":6391320,"14":6291480,"15":6403800,"16":786432,"17":98304}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":537134082,"14":67372050,"15":8688770,"16":67372034,"17":537134082}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":112639,"14":37750328,"15":269071928,"16":306806840,"17":269072383}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":459276434,"14":1048066,"15":454000786,"16":403672704,"17":459538066}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":98304,"8":34451520,"9":38646344,"10":38376000,"11":4977472,"12":20971368,"13":154925421,"14":165366056,"15":148572416,"16":1573120,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":114819072,"10":1572864,"11":114985472,"12":100829696,"13":115006390,"14":166406,"15":166838,"16":384,"17":438}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":1597440,"8":1794048,"9":196608,"10":0,"11":268509186,"12":268509186,"13":268509186,"14":306783378,"15":306783378,"16":268509186,"17":268509186}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":304086982,"14":268435462,"15":307682118,"16":5525830,"17":39082822}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":75497472,"10":537919776,"11":537921540,"12":75499524,"13":537921540,"14":537919776,"15":75728900,"16":1865732,"17":229664}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":1495698,"11":18109056,"12":18272914,"13":17678330,"14":766262930,"15":682475513,"16":766250497,"17":901113}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":153092096,"12":306708480,"13":460161024,"14":613564416,"15":766958080,"16":920350080,"17":1073741816}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":221184,"10":1597440,"11":24576,"12":36864,"13":299520,"14":2359872,"15":19132488,"16":18873864,"17":18615816}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":671088647,"13":83886136,"14":10486208,"15":672402951,"16":84078648,"17":10736064}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":2,"9":0,"10":56,"11":0,"12":3072,"13":0,"14":163840,"15":0,"16":8388608,"17":402653184}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":402653184,"11":452984832,"12":56623104,"13":7077912,"14":897240,"15":112344,"16":14040,"17":1728}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":73728,"9":73728,"10":599040,"11":14680256,"12":1071866075,"13":1071866075,"14":14680256,"15":1497600,"16":184320,"17":184320}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":4719744,"12":4719744,"13":306709650,"14":306709650,"15":4719744,"16":4719744,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":110592,"10":898560,"11":6402240,"12":57411288,"13":57411288,"14":6402240,"15":898560,"16":110592,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":766774125,"10":766774125,"11":11799360,"12":11983680,"13":11983680,"14":11799360,"15":766774125,"16":766774125,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":599040,"9":4194432,"10":4194432,"11":4793472,"12":4194432,"13":4194432,"14":599040,"15":0,"16":0,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":918553014,"9":920128950,"10":1797120,"11":14159232,"12":14159232,"13":14159232,"14":1797120,"15":920128950,"16":918553014,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":95420776,"10":11668288,"11":1460736,"12":1492992,"13":1497344,"14":164128,"15":9586976,"16":9586976,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":19136512,"9":134251664,"10":136617986,"11":134217730,"12":134217730,"13":134217730,"14":134259842,"15":19144706,"16":1168,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":2925,"12":32765,"13":31597,"14":0,"15":0,"16":0,"17":0}',
    '{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":224256,"10":1797504,"11":14380464,"12":0,"13":2396744,"14":4166216,"15":2396744,"16":584,"17":584}',
];

default_map.forEach( e => boardMap.push(JSON.parse(e)));

chobocho_map.sort(() => Math.random() - 0.5);
chobocho_map.forEach(e => boardMap.push(JSON.parse(e)));
mapString.sort(() => Math.random() - 0.5);
mapString.forEach( e => boardMap.push(JSON.parse(e)));


