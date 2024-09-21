-- SQL file: font_system.sql

-- Create fonts table to store uploaded fonts
CREATE TABLE fonts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create font_groups table to store font groups
CREATE TABLE font_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a junction table to link fonts and font groups
CREATE TABLE font_group_fonts (
    group_id INT,
    font_id INT,
    font_title VARCHAR(255) NOT NULL,
    PRIMARY KEY (group_id, font_id),
    FOREIGN KEY (group_id) REFERENCES font_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (font_id) REFERENCES fonts(id) ON DELETE CASCADE
);

