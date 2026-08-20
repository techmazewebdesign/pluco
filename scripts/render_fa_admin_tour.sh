#!/bin/zsh
set -euo pipefail

voice_dir="${1:-/Users/rooz/Documents/Codex/2026-08-20/the-2/work/piper-voices}"
piper_bin="${2:-/Users/rooz/Documents/Codex/2026-08-20/the-2/work/piper-env/bin/piper}"
model="${voice_dir}/fa_IR-ganji-medium.onnx"
source_video="public/training/pluco-admin-dashboard-tour.mp4"
output_video="public/training/pluco-admin-dashboard-tour-fa.mp4"
render_dir="/Users/rooz/Documents/Codex/2026-08-20/the-2/work/video-review/fa-render"
mkdir -p "${render_dir}"

segments=(
  'به داشبورد مدیریت پلوکو خوش آمدید. این صفحه نمایی سریع از تعداد موکلان، سرنخ‌های در انتظار، پرونده‌های فعال و وضعیت ابزارهای هوشمند ارائه می‌دهد. هر روز از همین نمای کلی شروع کنید و ابتدا مواردی را بررسی کنید که نیاز به اقدام فوری دارند.'
  'در پلوکو سه مدیر تأییدشده مسئول بخش‌های عملیاتی هستند. هر مدیر باید فقط با حساب شخصی و تأییدشده خود وارد شود. نقش‌ها و دسترسی‌ها را روشن نگه دارید، واگذاری‌های حساس را ثبت کنید و اطلاعات محرمانه موکلان را خارج از فضای امن به اشتراک نگذارید.'
  'در شروع روز، سرنخ‌های جدید، پیگیری‌های عقب‌افتاده، اعلان‌ها و رزروهای مشاوره را مرور کنید. برای هر مورد، وضعیت فعلی و اقدام بعدی را ثبت کنید. این کار کمک می‌کند هیچ تماس، مهلت یا درخواست مهمی بدون پاسخ باقی نماند.'
  'برای اضافه کردن یک موکل قدیمی، وارد بخش مدیریت کاربران شوید و گزینه افزودن موکل قدیمی را انتخاب کنید. نام و ایمیل الزامی است. در صورت وجود، تلفن، کشور، شناسه قدیمی، تاریخ آخرین تماس و یادداشت پرونده را نیز وارد کنید. ارسال ایمیل به صورت پیش‌فرض خاموش است.'
  'برای وارد کردن چند موکل، فایل سی اس وی نمونه را دانلود کنید. هر ردیف باید یک موکل باشد و ستون‌های نام کامل و ایمیل را داشته باشد. سامانه ویرگول داخل متن نقل‌قول‌شده را می‌خواند، ردیف‌های تکراری یا ناقص را اعلام می‌کند و پیش از ذخیره تعداد رکوردهای قابل خواندن را نشان می‌دهد.'
  'دسترسی تیم فروش از پرونده‌های خصوصی جدا نگه داشته می‌شود. مدیران عملیات حساس را مدیریت می‌کنند و اعضای تیم فروش فقط در فضای کاری مجاز خود فعالیت دارند. دعوت‌نامه فقط برای همان حساب ایمیل تأییدشده معتبر است و هر تغییر در تاریخچه فعالیت ثبت می‌شود.'
  'مدیریت موکلان، پرونده‌ها، رزروها و نقش‌ها در داشبورد پلوکو انجام می‌شود. ویرایش محتوای عمومی وب‌سایت در فضای کنترل دسیوو باقی می‌ماند. این جداسازی باعث می‌شود کارهای عملیاتی، محتوای عمومی و دسترسی‌های خصوصی با یکدیگر مخلوط نشوند.'
  'در پایان هر هفته بر اساس شواهد تصمیم بگیرید. کشورها و صفحه‌هایی را که بیشترین توجه ایجاد کرده‌اند بررسی کنید، اقدام بعدی هر موکل را به‌روز کنید و گفت‌وگوهای باکیفیت را در اولویت قرار دهید. برای بازبینی دوباره، از دکمه راهنمای داشبورد استفاده کنید و در پایان کار از حساب خود خارج شوید.'
)
targets=(24 24 24 24 24 24 24 25.866)

for index in {1..8}; do
  raw="${render_dir}/raw-${index}.wav"
  fixed="${render_dir}/fixed-${index}.wav"
  print -r -- "${segments[$index]}" | "${piper_bin}" --model "${model}" --output_file "${raw}" --sentence-silence 0.35 --length-scale 1.05
  duration=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${raw}")
  target="${targets[$index]}"
  factor=$(awk -v d="${duration}" -v t="${target}" 'BEGIN { f=d/(t-0.35); if (f<0.5) f=0.5; if (f>2) f=2; printf "%.6f", f }')
  ffmpeg -loglevel error -y -i "${raw}" -af "atempo=${factor},apad" -t "${target}" -ar 44100 -ac 1 "${fixed}"
done

ffmpeg -loglevel error -y \
  -i "${render_dir}/fixed-1.wav" -i "${render_dir}/fixed-2.wav" -i "${render_dir}/fixed-3.wav" -i "${render_dir}/fixed-4.wav" \
  -i "${render_dir}/fixed-5.wav" -i "${render_dir}/fixed-6.wav" -i "${render_dir}/fixed-7.wav" -i "${render_dir}/fixed-8.wav" \
  -filter_complex '[0:a][1:a][2:a][3:a][4:a][5:a][6:a][7:a]concat=n=8:v=0:a=1[out]' -map '[out]' "${render_dir}/fa-narration.wav"

ffmpeg -loglevel error -y -i "${source_video}" -i "${render_dir}/fa-narration.wav" \
  -map 0:v:0 -map 1:a:0 -vf scale=-2:720 -c:v libx264 -preset slow -crf 27 -maxrate 900k -bufsize 1800k \
  -c:a aac -b:a 64k -ar 44100 -shortest -metadata:s:a:0 language=fas "${output_video}"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels:stream_tags=language -of json "${output_video}"
