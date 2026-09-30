import re
import os

filepath = '/Users/thientrang/Documents/2. Study/7, Gia Khanh/websitecungonluyen/src/components/HomeView.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Pattern for Banner
banner_pattern = r"(      {/\* ================================================================= \*/}\n      {/\* BANNER NGANG LỚN - \"ÔN LUYỆN TUYỂN SINH\" \*/}.*?      </section>\n)"
# Pattern for Cards
cards_pattern = r"(\n      {/\* ================================================================= \*/}\n      {/\* 2 CARD GỌN: \"LUYỆN TẬP\" \+ \"KHO ĐỀ THI\" \*/}.*?      </div>\n)"
# Pattern for Widgets
widgets_pattern = r"(\n      {/\* ================================================================= \*/}\n      {/\* HOME DASHBOARD WIDGETS.*?</HomeDashboardWidgets>\n)"

banner = re.search(banner_pattern, content, re.DOTALL).group(1)
cards = re.search(cards_pattern, content, re.DOTALL).group(1)
widgets = re.search(widgets_pattern, content, re.DOTALL).group(1)

# Replace them with empty strings
new_content = content.replace(banner, "").replace(cards, "").replace(widgets, "")

# Find the end of the wrapper div
end_div_idx = new_content.rfind('    </div>\n  );\n};')

# Insert widgets -> banner -> cards
insertion = widgets + "\n" + banner + cards

final_content = new_content[:end_div_idx] + insertion + "\n" + new_content[end_div_idx:]

# Also reduce the logo size by half. Current is:
# className="h-40 sm:h-48 md:h-56 w-auto object-contain select-none drop-shadow-sm transition-all duration-300 scale-[1.3] sm:scale-[1.5]"
# Replace it with:
# className="h-20 sm:h-24 md:h-28 w-auto object-contain select-none drop-shadow-sm transition-all duration-300"
# and remove negative margins from its container to prevent overlap since it's smaller now:
# -mt-8 sm:-mt-10 -mb-10 sm:-mb-16 -> py-2

final_content = final_content.replace(
    'className="flex justify-center -mt-8 sm:-mt-10 -mb-10 sm:-mb-16 relative z-10 pointer-events-none"',
    'className="flex justify-center py-2 relative z-10 pointer-events-none"'
).replace(
    'className="h-40 sm:h-48 md:h-56 w-auto object-contain select-none drop-shadow-sm transition-all duration-300 scale-[1.3] sm:scale-[1.5]"',
    'className="h-20 sm:h-24 md:h-28 w-auto object-contain select-none drop-shadow-sm transition-all duration-300"'
)

with open(filepath, 'w') as f:
    f.write(final_content)

print("Reordered successfully!")
