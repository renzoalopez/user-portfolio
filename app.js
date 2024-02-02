// Filter Function JS
init__filters()

function init__filters() {
    let filter_buttons = document.querySelectorAll('.filters-controls button')
    if (filter_buttons.length > 0) {
        let filters_panel = document.querySelector('.filters-panel')
        let filter_items = document.querySelectorAll('.filters-panel .item')

        // Handle Filter Buttons
        sub__handleFiltersButtons(filter_items, filters_panel)
    }

    function sub__handleFiltersButtons(items, panel) {
        filter_buttons.forEach((button) => {
            button.addEventListener('click', (e) => {
                // Handle Filter Button
                let active_item = document.querySelector(
                    '.filters-controls button[aria-selected="true"]'
                )
                active_item.setAttribute('aria-selected', false)
                button.setAttribute('aria-selected', true)

                sub__handleFiltersPanel(items, button, panel)
            })
        })
    }

    function sub__handleFiltersPanel(filter_items, button, filters_panel) {
        if (filters_panel) {
            // First Promise: Hide Panel
            return new Promise((resolve, reject) => {
                // Disable Buttons
                filter_buttons.forEach((btn) => {
                    btn.classList.add('pointer-none')
                })

                // Step 1: Add class 'fadeOutDown'
                filters_panel.classList.add('fadeOutDown')

                // Step 2: onAnimationEnd Resolve
                filters_panel.addEventListener(
                    'animationend',
                    () => {
                        resolve('Done!')
                    },
                    { once: true }
                )
            })

                .then(() => {
                    // Second Promise: Show Panel
                    return new Promise((resolve, reject) => {
                        // Update Filtered Items
                        sub__executeFilterCondition(
                            filters_panel,
                            filter_items,
                            button
                        )

                        // Find delay if exist
                        let delay = filters_panel.dataset.animationDelay
                        delay
                            ? (delay = filters_panel.dataset.animationDelay)
                            : (delay = 0)

                        // Step 1: Add class 'fadeInUp'
                        setTimeout(() => {
                            filters_panel.classList.add('fadeInUp')
                        }, delay)

                        // Step 2: onAnimationEnd Resolve
                        filters_panel.addEventListener(
                            'animationend',
                            () => {
                                resolve('Done!')
                            },
                            { once: true }
                        )
                    }).then(() => {
                        // Remove classes
                        filters_panel.classList.remove('fadeOutDown')
                        filters_panel.classList.remove('fadeInUp')

                        // Enable Buttons
                        filter_buttons.forEach((btn) => {
                            btn.classList.remove('pointer-none')
                        })
                    })
                })

                .finally(() => {
                    console.log('Promise Ended')
                })
        }
    }

    function sub__executeFilterCondition(filters_panel, filter_items, button) {
        let curr__filter = button.dataset.filter
        let curr__items = filter_items
        let filtered__items = []
        let other__items = []

        sub__separateFilterItemsByCategory(
            curr__items,
            filtered__items,
            other__items,
            filter_items
        )
        sub__handleFilterItemsResults(filtered__items, other__items)
        sub__handlePanelResultItems(
            filters_panel,
            filtered__items,
            other__items
        )

        // Recalculate the height of page for correct ScrollTrigger animations
        // ScrollTrigger.refresh();

        /*******************************************/
        /* Sub Functions ***************************/
        /*******************************************/
        function sub__resetFilterItemsOrderAttributes(item) {
            item.removeAttribute('data-filter-order')
            item.removeAttribute('data-other-order')
        }

        function sub__separateFilterItemsByCategory(
            curr__items,
            filtered__items,
            other__items,
            filter_itemss
        ) {
            // Function: Separating Items By Selected Category

            curr__items.forEach((item) => {
                sub__resetFilterItemsOrderAttributes(item)

                if (curr__filter == 'all') {
                    filtered__items.push(item)
                } else {
                    let dft_item_categories = item.dataset.filterCategories
                    dft_item_categories.includes(curr__filter)
                        ? filtered__items.push(item)
                        : other__items.push(item)
                }
            })
        }

        function sub__handleFilterItemsResults(filtered__items, other__items) {
            // Function: Execute Results

            // Handle Filtered Items
            filtered__items.forEach((item, idx) => {
                item.setAttribute('data-filter-order', idx + 1)
            })

            // Get Length of Filtered Items For Starting Other Items Index
            let filteredItemsLength = filtered__items.length

            // Handle Other Items
            other__items.forEach((item, idx) => {
                filteredItemsLength += 1
                item.setAttribute('data-other-order', filteredItemsLength)
            })

            // console.log("Filtered Items:", filtered__items);
            // console.log("Other Items:", other__items);
        }

        function sub__handlePanelResultItems(
            filters_panel,
            filtered__items,
            other__items
        ) {
            /* Function:
             * Recreate Filter Panel with Items Order by Selected Category
             * Re order DOM Items, for styling. [ex: .item:nth-child(3)]
             */

            let fragment = document.createDocumentFragment()
            filtered__items.forEach((item) => {
                fragment.appendChild(item.cloneNode(true))
            })
            other__items.forEach((item) => {
                fragment.appendChild(item.cloneNode(true))
            })

            filters_panel.innerHTML = null
            filters_panel.appendChild(fragment)
        }
    }
}

// Active Navigation Function
const changeNav = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
            // Remove 'active' class from all navigation links0
            document.querySelectorAll('.nav-btn a').forEach((link) => {
                link.classList.remove('active')
            })

            // Get id of the intersecting section
            const id = entry.target.getAttribute('id')

            // Find matching link & add 'active' class
            const newLink = document.querySelector(`.nav-btn a[href="#${id}"]`)
            if (newLink) {
                newLink.classList.add('active')
            }
        }
    })

    // If no section is intersecting, remove 'active' class from all links
    if (
        !entries.some(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5
        )
    ) {
        document.querySelectorAll('.nav-btn a').forEach((link) => {
            link.classList.remove('active')
        })
    }
}

const options = {
    threshold: 0.8,
}

const observer = new IntersectionObserver(changeNav, options)

// Target the elements to be observed
const sections = document.querySelectorAll('section')
sections.forEach((section) => {
    observer.observe(section)
})
