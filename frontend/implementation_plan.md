# Issue Fixes Implementation Plan

## 1. Custom Pages (Terms & Conditions, Privacy, etc.)
- **Issue:** Custom pages management is not fully functional.
- **Action:** Ensure `AdminPages.jsx` correctly saves and updates `title`, `slug`, `content`, and `status`. Ensure `CustomPage.jsx` in the frontend fetches content by slug using `Entities.pages.list()` or `.get()`. Make sure standard pages like Terms and Privacy map correctly.

## 2. Team Members Display
- **Issue:** Team members show on frontend but not in Admin Dashboard.
- **Action:** Verify `AdminTeam.jsx` is using the correct table (`team_members`) and that the frontend `About.jsx` (or wherever Team is displayed) actually fetches from `Entities.team_members.list()` instead of using hardcoded mock data. 

## 3. Our Partners / Top Airlines
- **Issue:** The sliding design for partners is not working as expected (needs to mirror Top Airlines sliding design).
- **Action:** Review the component rendering "Our Partners" or "Airlines" in `Home.jsx`. If it is `AirlinesSection.jsx`, I will modify its UI to use a smooth sliding carousel identical to modern "Top Airlines" marquee/slider designs.

## 4. Media Manager / File Manager Update
- **Issue:** Media Manager doesn't show all website images dynamically; it's not fully integrated.
- **Action:** 
  - Update `backend/routes/upload.js` to scan the entire `public/uploads` folder and return a complete list of all uploaded images.
  - Enhance `AdminMedia.jsx` to display these dynamically, allow deletions, and have a better UI for file management.
  - Ensure image uploads from packages/hotels properly save to `public/uploads` so the Media Manager sees them.
