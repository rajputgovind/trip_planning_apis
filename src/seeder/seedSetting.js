import 'dotenv/config'
import connectDb from '../db/connectDb.js'
import AdminSetting from '../models/AdminSetttingModel.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const existingSetting = await AdminSetting.find()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// const image = fs.readFileSync('../../public/tripLogoImages/mainTripLogo.png')

const imagePath = path.join(
  __dirname,
  '../public/tripLogoImages/new-trip-logo.png'
)
const bgImagePath = path.join(__dirname, '../public/tripLogoImages/herobg.svg')

const imageName = path.basename(imagePath)
const bgImageName = path.basename(bgImagePath)

if (!existingSetting.length) {
  const adminSetting = {
    mainLogo: imageName,
    heading: 'اكتشف العالم، خوض التجارب، تعرف على الثقافات! سافر',
    mainContent: 'رحلات جماعية، لحظات غامرة!',
    headerColor: 'green',
    homePageBannerImage: bgImageName,
    searchPageBannerImage: bgImageName,
    email: 'example@example.com',
    city: 'City',
    zipCode: 452001,
    state: 'State',
    address: '123 Example Street',
    linkedInUrl: 'https://www.linkedin.com/',
    twitterUrl: 'https://twitter.com/?lang=en',
    instagramUrl: 'https://www.instagram.com/',
    facebookUrl: 'https://www.facebook.com/',
    termsAndConditions: '1-معلومات موقع جيت8 ( Gate8  ) الإلكتروني والمسجلين فيها هم منظم الرحلة والمشارك في الرحلة 1.1موقع جيت8 هو منصة لربط المنظمين للرحلات بالمشاركين المهتمين بالانضمام إلى الرحلات. 1.2موقع جيت8 يقدم منصة للمنظم لنشر معلومات حول الرحلة بما في ذلك التواريخ والأنشطة والتكاليف التي يقدمها منظم الرحلة 1.3موقع جيت8 ليس مسؤولًا عن صحة المعلومات المقدمة من قبل المنظم أو أي ترويج للرحلة. 1.4 المشاركين يستطيعون التسجيل على موقع جيت8 والمشاركة في الرحلة بناءً على اختيارهم. 1.5 موقع جيت8 لا يتدخل في ترتيبات تنظيم الرحلة أو دفع الأموال بين المنظم والمشاركين. 1.6 موقع جيت8 غير مسؤول عن أية مشكلات أو توترات تنشأ بين المنظم والمشاركين. 1.7موقع جيت8 لا يتحمل مسؤولية أي أضرار أو خسائر مادية أو معنوية تنجم عن استخدام موقع جيت8. 1.8 المشاركين يوافقون على أن موقع جيت8 يعمل كوسيط رقمي فقط وليس له أي دور في تنظيم الرحلة نفسها. 1.9المشاركين يوافقون على إخلاء موقع جيت8 من أي مسؤولية تجاه الأضرار أو الخسائر التي يمكن أن تحدث خلال الرحلة. 1.10قد نساعدك في موقع جيت8 على التواصل مع منظم الرحلة الخاص بك، لكن لا يمكننا ضمان أنه سيقرأ أي شيء منك، أو أنه سيفعل ما تطلبه. حقيقة أنك تتواصل معه، أو أنه يتصل بك، في حد ذاتها، لا تعني أنه لديك أي سبب لاتخاذ إجراء قانوني 1.11المشارك يوافق على هذه البنود والشروط عند التسجيل على موقع جيت 8 والمشاركة في الرحلة. 2-الملكية الفكرية وحقوق النشر والتوزيع والخصوصية ​ 2.1 المنظم للرحلة يحتفظ بحقوق الملكية الفكرية للمحتوى والمواد المنشورة بواسطته على موقع جيت8 بما في ذلك النصوص والصور والمقاطع كما يلتزم بقوانين حقوق الملكية والنشر والتوزيع في جميع منشوراته بدون ادنى مسؤولية على موقع جيت8 2.2 المشاركين لا يحق لهم نسخ أو تعديل أو نشر أو توزيع المحتوى الموجود على موقع جيت8 دون إذن خطي من المنظم. 2.3 المشاركين يوافقون على أن المعلومات والبيانات التي يتم تقديمها على موقع جيت 8 يمكن استخدامها من قبل المنظم وموقع جيت8 لأغراض تنظيم الرحلة والتواصل مع المشاركين. 2.4 موقع جيت8 يمكن استخدام معلومات المشاركين للأغراض التسويقية والدعائية بما في ذلك إعلانات المنظمين على موقع جيت8.​ ​ 2.5 المشاركين يوافقون على أن موقع جيت8 يحق له استخدام معلوماتهم في الدعاية والإعلان لرحلات أخرى على موقع جيت8. ​ 2.6 موقع جيت8 يلتزم بحماية خصوصية المشاركين وعدم مشاركة معلوماتهم الشخصية مع أطراف خارجية بدون إذن ويستثنى من ذلك معلومات التواصل وذلك لأغراض دعائية وتسويقيه فقط 2.7 يقوم المشارك بتحميل بعض الملفات الخاصة به على موقع جيت8 على سبيل المثال لا الحصر صور جوازات السفر صور ايصالات الدفع وغيرها من المستندات حيث انها تصل مباشرة لمنظم الرحلة ولا يملك موقع جيت8 إمكانية الاطلاع عليها ويلتزم منظم الرحلة بالمحافظة على خصوصية هذه المستندات وسريتها ولا يحق له إعادة نشرها او استخدامها لغير الغرض المخصص له ​ ​ 2.7 المشارك يوافق على هذه البنود والشروط عند التسجيل على الموقع والمشاركة في الرحلة.​ 3-واجبات المشاركين في الرحلات مع منظم الرحلة عبر موقع جيت8 ​ 3.1 المشاركين ملزمون باتباع التعليمات والتوجيهات الصادرة من المنظم للرحلة. 3.2 يجب على المشاركين الامتثال للجدول الزمني والأنشطة المقترحة والقوانين المحلية أثناء الرحلة. 3.3 المشاركين مسؤولون عن سلامتهم الشخصية والتقيد بالإرشادات الأمنية والصحية الصادرة عن المنظم.​ 3.4 يجب على المشاركين الإبلاغ عن أي مشكلة أو أخطار تؤثر على السلامة.​ ​ 3.5 المشاركين يلتزمون بالتواصل مع المنظم للرحلة بشكل فعال وفي الوقت المناسب.​ 3.6 في حالة عدم الامتثال للتواصل أو الإهمال في تقديم المعلومات المطلوبة، قد يتم رفض مشاركتهم في الرحلة.​ 3.7 المنظم للرحلة يحتفظ بحق إلغاء مشاركة أي فرد يخالف التعليمات أو يعرض سلامة الرحلة للخطر.​ 3.8 في حالة إلغاء مشاركة المشارك نتيجة لعدم الامتثال، لن يتم استرداد أية أموال.​ 3.9 المشارك يوافق على هذه البنود والشروط عند التسجيل على الموقع والمشاركة في الرحلة. 4-منظم الرحلة تعريفات واجبات والتزامات 4.1 المنظم للرحلة مسؤول عن إنشاء ونشر تفاصيل الرحلة على موقع جيت8 بشكل دقيق ومفصل.​ 4.2 المنظم يلتزم بتقديم معلومات صحيحة ومحدثة بشأن تاريخ الرحلة والتكاليف والأنشطة.​ 4.3 المنظم للرحلة يقدم وسيلة الدفع المناسبة للمشاركين في الرحلة حيث ان جميع التعاملات المالية تكون فقط بين منظم الرحلة والمشارك فيها دون أي تدخل او مسؤوليه من موقع جيت8 4.4 يجب دفع تكلفة المشاركة كما هو محدد في الاتفاقية مباشرة من المشارك للمنظم​ 4.5 يلتزم منظم الرحلة بتقديم اتفاقية كاملة للمشارك تتضمن التكلفة وسياسات الإلغاء ان وجدت وكذلك معلومات تامين السفر وغيرها من البنود التي تضمن حق جميع الأطراف حيث انه موقع جيت8 غير مسؤول عن الاتفاق بين المنظم والمشارك​ ​ 4.6 المنظم للرحلة غير مسؤول عن فقدان أو تلف الممتلكات الشخصية للمشاركين. كما أنه غير مسؤول عن أية إصابات تحدث خلال الرحلة، ما لم تنجم عن إهمال واضح من جانب المنظم ويحدد ذلك طرف ثالث.​ ​',

    privacyPolicy: '1-معلومات موقع جيت8 ( Gate8  ) الإلكتروني والمسجلين فيها هم منظم الرحلة والمشارك في الرحلة 1.1موقع جيت8 هو منصة لربط المنظمين للرحلات بالمشاركين المهتمين بالانضمام إلى الرحلات. 1.2موقع جيت8 يقدم منصة للمنظم لنشر معلومات حول الرحلة بما في ذلك التواريخ والأنشطة والتكاليف التي يقدمها منظم الرحلة 1.3موقع جيت8 ليس مسؤولًا عن صحة المعلومات المقدمة من قبل المنظم أو أي ترويج للرحلة. 1.4 المشاركين يستطيعون التسجيل على موقع جيت8 والمشاركة في الرحلة بناءً على اختيارهم. 1.5 موقع جيت8 لا يتدخل في ترتيبات تنظيم الرحلة أو دفع الأموال بين المنظم والمشاركين. 1.6 موقع جيت8 غير مسؤول عن أية مشكلات أو توترات تنشأ بين المنظم والمشاركين. 1.7موقع جيت8 لا يتحمل مسؤولية أي أضرار أو خسائر مادية أو معنوية تنجم عن استخدام موقع جيت8. 1.8 المشاركين يوافقون على أن موقع جيت8 يعمل كوسيط رقمي فقط وليس له أي دور في تنظيم الرحلة نفسها. 1.9المشاركين يوافقون على إخلاء موقع جيت8 من أي مسؤولية تجاه الأضرار أو الخسائر التي يمكن أن تحدث خلال الرحلة. 1.10قد نساعدك في موقع جيت8 على التواصل مع منظم الرحلة الخاص بك، لكن لا يمكننا ضمان أنه سيقرأ أي شيء منك، أو أنه سيفعل ما تطلبه. حقيقة أنك تتواصل معه، أو أنه يتصل بك، في حد ذاتها، لا تعني أنه لديك أي سبب لاتخاذ إجراء قانوني 1.11المشارك يوافق على هذه البنود والشروط عند التسجيل على موقع جيت 8 والمشاركة في الرحلة. 2-الملكية الفكرية وحقوق النشر والتوزيع والخصوصية ​ 2.1 المنظم للرحلة يحتفظ بحقوق الملكية الفكرية للمحتوى والمواد المنشورة بواسطته على موقع جيت8 بما في ذلك النصوص والصور والمقاطع كما يلتزم بقوانين حقوق الملكية والنشر والتوزيع في جميع منشوراته بدون ادنى مسؤولية على موقع جيت8 2.2 المشاركين لا يحق لهم نسخ أو تعديل أو نشر أو توزيع المحتوى الموجود على موقع جيت8 دون إذن خطي من المنظم. 2.3 المشاركين يوافقون على أن المعلومات والبيانات التي يتم تقديمها على موقع جيت 8 يمكن استخدامها من قبل المنظم وموقع جيت8 لأغراض تنظيم الرحلة والتواصل مع المشاركين. 2.4 موقع جيت8 يمكن استخدام معلومات المشاركين للأغراض التسويقية والدعائية بما في ذلك إعلانات المنظمين على موقع جيت8.​ ​ 2.5 المشاركين يوافقون على أن موقع جيت8 يحق له استخدام معلوماتهم في الدعاية والإعلان لرحلات أخرى على موقع جيت8. ​ 2.6 موقع جيت8 يلتزم بحماية خصوصية المشاركين وعدم مشاركة معلوماتهم الشخصية مع أطراف خارجية بدون إذن ويستثنى من ذلك معلومات التواصل وذلك لأغراض دعائية وتسويقيه فقط 2.7 يقوم المشارك بتحميل بعض الملفات الخاصة به على موقع جيت8 على سبيل المثال لا الحصر صور جوازات السفر صور ايصالات الدفع وغيرها من المستندات حيث انها تصل مباشرة لمنظم الرحلة ولا يملك موقع جيت8 إمكانية الاطلاع عليها ويلتزم منظم الرحلة بالمحافظة على خصوصية هذه المستندات وسريتها ولا يحق له إعادة نشرها او استخدامها لغير الغرض المخصص له ​ ​ 2.7 المشارك يوافق على هذه البنود والشروط عند التسجيل على الموقع والمشاركة في الرحلة.​ 3-واجبات المشاركين في الرحلات مع منظم الرحلة عبر موقع جيت8 ​ 3.1 المشاركين ملزمون باتباع التعليمات والتوجيهات الصادرة من المنظم للرحلة. 3.2 يجب على المشاركين الامتثال للجدول الزمني والأنشطة المقترحة والقوانين المحلية أثناء الرحلة. 3.3 المشاركين مسؤولون عن سلامتهم الشخصية والتقيد بالإرشادات الأمنية والصحية الصادرة عن المنظم.​ 3.4 يجب على المشاركين الإبلاغ عن أي مشكلة أو أخطار تؤثر على السلامة.​ ​ 3.5 المشاركين يلتزمون بالتواصل مع المنظم للرحلة بشكل فعال وفي الوقت المناسب.​ 3.6 في حالة عدم الامتثال للتواصل أو الإهمال في تقديم المعلومات المطلوبة، قد يتم رفض مشاركتهم في الرحلة.​ 3.7 المنظم للرحلة يحتفظ بحق إلغاء مشاركة أي فرد يخالف التعليمات أو يعرض سلامة الرحلة للخطر.​ 3.8 في حالة إلغاء مشاركة المشارك نتيجة لعدم الامتثال، لن يتم استرداد أية أموال.​ 3.9 المشارك يوافق على هذه البنود والشروط عند التسجيل على الموقع والمشاركة في الرحلة. 4-منظم الرحلة تعريفات واجبات والتزامات 4.1 المنظم للرحلة مسؤول عن إنشاء ونشر تفاصيل الرحلة على موقع جيت8 بشكل دقيق ومفصل.​ 4.2 المنظم يلتزم بتقديم معلومات صحيحة ومحدثة بشأن تاريخ الرحلة والتكاليف والأنشطة.​ 4.3 المنظم للرحلة يقدم وسيلة الدفع المناسبة للمشاركين في الرحلة حيث ان جميع التعاملات المالية تكون فقط بين منظم الرحلة والمشارك فيها دون أي تدخل او مسؤوليه من موقع جيت8 4.4 يجب دفع تكلفة المشاركة كما هو محدد في الاتفاقية مباشرة من المشارك للمنظم​ 4.5 يلتزم منظم الرحلة بتقديم اتفاقية كاملة للمشارك تتضمن التكلفة وسياسات الإلغاء ان وجدت وكذلك معلومات تامين السفر وغيرها من البنود التي تضمن حق جميع الأطراف حيث انه موقع جيت8 غير مسؤول عن الاتفاق بين المنظم والمشارك​ ​ 4.6 المنظم للرحلة غير مسؤول عن فقدان أو تلف الممتلكات الشخصية للمشاركين. كما أنه غير مسؤول عن أية إصابات تحدث خلال الرحلة، ما لم تنجم عن إهمال واضح من جانب المنظم ويحدد ذلك طرف ثالث.​ ​',

    aboutUs: 'about us',
    vision: 'Vision'
    
  }
  await AdminSetting.insertMany(adminSetting)
  console.log('Admin Setting is running')
} else {
  console.log('Admin setting already exist')
}
