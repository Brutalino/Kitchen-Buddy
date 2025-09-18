# Kitchen Buddy - Mobile Systems Engineering Project

Kitchen Buddy is a React Native application built with Expo, designed to help users efficiently track their kitchen ingredients. The primary goal is to reduce food waste by providing a clear overview of what's available, what's expiring soon, and what needs to be used.

The application is built following modern mobile development principles, including **Functional Programming** and a strong **TypeScript** foundation. It features a clean, component-based architecture and centralized state management using React's Context API.

## Core Features

-   **Persistent Storage:** All ingredient data is saved on the device using `AsyncStorage`, ensuring it persists between app launches.
-   **Efficient Data Entry:** A streamlined form allows users to add new ingredients, specifying their name, brand, category, location, and expiration date.
-   **Barcode Scanning:** Utilizes the device's camera to scan product barcodes, fetching product data from the OpenFoodFacts API to pre-fill the entry form.
-   **Advanced Ingredient Tracking:**
    -   **Expiration Alerts:** A dedicated screen shows items that are expiring soon or have been opened.
    -   **Ripeness Status:** Users can track and update the ripeness of fresh ingredients (e.g., "Ripe", "Green").
    -   **Open/Frozen Status:** Users can mark items as "open" to prioritize their use or "freeze" them to automatically extend their shelf life.
-   **Smart Querying & Filtering:** A flexible browsing screen allows users to view ingredients by recent additions, missing data, location, category, or ripeness check status.
-   **Full CRUD Functionality:** Users can Create, Read, Update, and Delete (CRUD) ingredients.

---

## Component Architecture

The application is structured using a component-based architecture. Below is a list of all major custom components defined in the project, along with their responsibilities, props, and internal state.

### 1. Core App Structure & Navigation

-   **`RootLayout` (`app/_layout.tsx`)**
    -   **Description:** The absolute root of the application. It sets up the main `Stack` navigator and, most importantly, wraps the entire app in the `IngredientsProvider` to make the global state available everywhere.
    -   **Props:** None.
    -   **State:** None.

-   **`TabLayout` (`app/(tabs)/_layout.tsx`)**
    -   **Description:** Defines the main bottom tab navigation interface with three primary screens: "Add", "Expiring", and "Browse".
    -   **Props:** None.
    -   **State:** None.

-   **`ScreensLayout` (`app/(screens)/_layout.tsx`)**
    -   **Description:** Defines the stack navigation for auxiliary screens that are pushed on top of the main tabs (like "Edit" and "Scanner"). It configures a consistent header style for these screens.
    -   **Props:** None.
    -   **State:** None.

### 2. Main Screen Components

-   **`AddIngredientScreen` (`app/(tabs)/add.tsx`)**
    -   **Description:** Renders the form for adding new ingredients. It includes input fields, custom pickers, and a date selector. It also features a button to launch the barcode scanner.
    -   **Props:** None.
    -   **State:**
        -   `name: string`: The name of the ingredient.
        -   `brand: string`: The brand of the ingredient.
        -   `category: IngredientCategory`: The selected category.
        -   `location: IngredientLocation`: The selected storage location.
        -   `confectionType: ConfectionType`: The selected confection type.
        -   `date: Date | undefined`: The expiration date.
        -   `ripeness: Ingredient['ripeness']`: The ripeness status object.
        -   `isDatePickerVisible: boolean`: Controls the visibility of the date picker modal.
        -   `tempDate: Date`: Holds the date value while the iOS date picker is open.

-   **`EditIngredientScreen` (`app/(screens)/edit-ingredient.tsx`)**
    -   **Description:** Almost identical to the Add screen, but it pre-populates its fields with the data of an existing ingredient. It includes additional logic for freezing items and marking them as open.
    -   **Props:** None (receives `ingredientId` via route parameters).
    -   **State:** Same as `AddIngredientScreen`, plus `isOpen: boolean` for the "Open" switch.

-   **`ExpiringScreen` (`app/(tabs)/expiring.tsx`)**
    -   **Description:** Displays a list of ingredients that are expiring soon, have been opened, or are ripe. Provides filter controls (3, 7, 30 days) and a text search bar.
    -   **Props:** None.
    -   **State:**
        -   `daysThreshold: number`: The selected time window for expiring items (3, 7, or 30).
        -   `searchQuery: string`: The text entered into the search bar.

-   **`BrowseScreen` (`app/(tabs)/browse.tsx`)**
    -   **Description:** A flexible screen that displays ingredients based on various queries: recently added, missing data, by location, by category, or ripeness check needed.
    -   **Props:** None.
    -   **State:**
        -   `activeFilter: FilterType`: The currently selected query.
        -   `searchQuery: string`: The text entered into the search bar.

-   **`ScannerScreen` (`app/(screens)/scanner.tsx`)**
    -   **Description:** Uses `expo-camera` to render the device's camera view. It requests camera permissions, scans for barcodes, and fetches product data from the OpenFoodFacts API.
    -   **Props:** None.
    -   **State:**
        -   `permission: CameraPermissionResponse | null`: The camera permission status.
        -   `scanned: boolean`: A flag to prevent multiple scans in quick succession.
        -   `isLoading: boolean`: A flag to show a loading indicator during the API call.

### 3. Reusable Components

-   **`PlatformPicker` (`src/components/PlatformPicker.tsx`)**
    -   **Description:** A hybrid component that renders the native `<Picker>` on Android and a custom, modal-based picker (`CustomPicker`) on iOS to ensure a consistent and functional UX on both platforms.
    -   **Props:**
        -   `options: { label: string; value: string; }[]`: An array of options to display.
        -   `selectedValue: string`: The currently selected value.
        -   `onValueChange: (value: string) => void`: Callback function executed when a new value is selected.
    -   **State (iOS only):**
        -   `modalVisible: boolean`: Controls the visibility of the modal.
        -   `tempValue: string`: Holds the selected value inside the modal before confirmation.

-   **`CustomPicker` (`src/components/CustomPicker.tsx`)**
    -   **Description:** A fully custom picker component used on iOS. It consists of a button that, when pressed, opens a full-screen modal with a `FlatList` of options.
    -   **Props:** Same as `PlatformPicker`.
    -   **State:**
        -   `modalVisible: boolean`: Controls the visibility of the modal.


---


## Component Tree & Control Flow

This section visualizes the application's component hierarchy. The tree is annotated with comments in `typescript` syntax to illustrate the flow of data, callbacks, and state updates.

**Key for Annotations:**
-   `// Comments:` Explain the purpose and flow at various points.
-   `[STATE]:` Denotes an internal state managed by the component.
-   `{PROP}:` Denotes a prop passed down from a parent.
-   `<fn()>:` Denotes a callback function received from the context.
-   `--[ACTION]-->:` Represents a user interaction that triggers a function.
-   `<--[UPDATE]--:` Represents the re-rendering process triggered by a state change.


```typescript
// The entire application is wrapped by the context provider, making the global state available to all nested components.
<IngredientsProvider>
  // [STATE]: The global array of all ingredients.
  [STATE: ingredients[]]
  
  // [STATE]: A flag to check if initial data is being loaded from storage.
  [STATE: isLoading]
  
  // [CALLBACK]: Function to add a new ingredient to the state.
  [CALLBACK: addIngredient(data)]
  
  // [CALLBACK]: Function to update an existing ingredient in the state.
  [CALLBACK: updateIngredient(data)]
  
  <RootLayout>
    └── <Stack (Navigator)>
        ├── <TabLayout>
        │   └── <Tabs (Navigator)>
        │       ├── <AddIngredientScreen>
        │       │   // Local state for the form fields.
        │       │   [STATE: name, brand, category, etc.]
        │       │
        │       │   // User action triggers the local handler.
        │       │   --[ACTION]--> handleAddIngredient()
        │       │       |
        │       │       '->' <addIngredient(formData)>  // The handler calls the global callback from the context.
        │       │
        │       ├── <ExpiringScreen>
        │       │   // {PROP}: The component reads the global `ingredients` state from the context.
        │       │   {ingredients} 
        │       │
        │       │   // Local state for the screen's filters.
        │       │   [STATE: searchQuery, daysThreshold]
        │       │
        │       │   // <--[UPDATE]--> This component automatically re-renders whenever the global `ingredients` state changes.
        │       │
        │       │   └── <FlatList data={filteredIngredients}>
        │       │       └── <ExpiringItem {item: Ingredient}>
        │       │           // User action triggers navigation.
        │       │           --[ACTION]--> navigates to EditScreen
        │       │
        │       └── <BrowseScreen>
        │           // {PROP}: Also reads the global state from the context.
        │           {ingredients} 
        │           [STATE: searchQuery, activeFilter]
        │
        └── <ScreensLayout>
            └── <Stack (Navigator)>
                ├── <EditIngredientScreen>
                │   // {PROP}: `ingredientId` is received as a navigation parameter.
                │   {ingredientId} 
                │
                │   // Local state for the form, pre-populated with the ingredient's data.
                │   [STATE: name, brand, category, isOpen, etc.]
                │
                │   // User action triggers the local handler.
                │   --[ACTION]--> handleUpdateIngredient()
                │       |
                │       '->' <updateIngredient(updatedData)> // The handler calls the global callback from the context.
                │
                └── <ScannerScreen>
                    // Local state to manage the scanner's status.
                    [STATE: scanned, isLoading]
                    
                    // Event from the CameraView component triggers the handler.
                    --[ACTION]--> handleBarCodeScanned()
                        |
                        // The handler navigates back to the Add screen, passing the scanned data as parameters.
                        '->' router.push('/(tabs)/add', {scannedName, scannedBrand}) 
```

### Explanation of the Annotated Tree

*   **How callbacks are passed down:**
    The `IngredientsProvider` at the top defines the `addIngredient` and `updateIngredient` callbacks. Any component, such as `AddIngredientScreen` or `EditIngredientScreen`, can access them via the `useIngredients()` hook. The tree shows these components calling the callbacks, which are annotated with `// The handler calls the global callback...`.

*   **How these callbacks change the state:**
    When a callback like `updateIngredient` is invoked, the `// [CALLBACK]` annotation shows that its definition resides in the `IngredientsProvider`. This is where the central `// [STATE]: ingredients[]` is modified immutably. The flow from action to callback execution is clearly visible.

*   **How changes of state change the tree:**
    The annotation `// <--[UPDATE]--> This component automatically re-renders...` on `ExpiringScreen` illustrates the result of a state change. When the `ingredients` state in the `IngredientsProvider` is updated, React re-renders all components that consume it. The `{ingredients}` prop annotation clarifies that these components are receiving the new data, which then updates their UI.