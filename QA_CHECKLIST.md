# QA Checklist — Issue Tracker

## Auth
- [ ] Register works (validations shown)
- [ ] Login works
- [ ] Protected routes redirect to /login when logged out
- [ ] Logout clears token and redirects

## Issues
- [ ] Create issue works (title/description required)
- [ ] Edit issue works
- [ ] Delete issue requires confirmation and works
- [ ] Issue detail loads and shows status/priority chips
- [ ] Mark Resolved requires confirmation and works
- [ ] Mark Closed requires confirmation and works

## List + Search
- [ ] List loads with pagination
- [ ] Status counts cards show correct values
- [ ] Search is debounced (does not spam API)
- [ ] Requests cancel while typing (no outdated results)
- [ ] Filters work and reset to page 1

## UX / UI
- [ ] Loading skeletons show
- [ ] Empty states are friendly
- [ ] Buttons have visible focus (keyboard navigation)
- [ ] Mobile layout has no weird overflow
- [ ] Copy link works (toast shown)

## Error Handling
- [ ] 401 sends user to login flow (token cleared)
- [ ] Network errors show readable messages
