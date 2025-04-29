package com.github.blaszczyk.ramschi.ramschi_server.util;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.github.blaszczyk.ramschi.ramschi_server.persistence.ImageEntity;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import static org.imgscalr.Scalr.*;

@Component
public class ImageScaler {

    @Value("${image.thumbnail.height}")
    private int thumbnailHeight;

    @Value("${image.preview.width}")
    private int previewWidth;

    public void addThumbnailAndPreview(ImageEntity entity) {

        final BufferedImage tempImage = getImage(entity);
        final int orientation = getOrientation(entity);
        final BufferedImage image = fixOrientation(tempImage, orientation);

        final int previewHeight = previewWidth * image.getHeight() / image.getWidth();
        final BufferedImage preview = buffered(image.getScaledInstance(previewWidth, previewHeight, Image.SCALE_SMOOTH));

        entity.setPreview(getBytes(preview));

        final int thumbnailWidth = thumbnailHeight * previewWidth / previewHeight;
        final BufferedImage thumbnail = buffered(preview.getScaledInstance(thumbnailWidth, thumbnailHeight, Image.SCALE_SMOOTH));
        entity.setThumbnail(getBytes(thumbnail));
    }

    private BufferedImage getImage(ImageEntity entity) {
        try (final InputStream inputStream = new ByteArrayInputStream(entity.getOriginal())) {
            return ImageIO.read(inputStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private int getOrientation(ImageEntity entity) {
        try (final InputStream inputStream = new ByteArrayInputStream(entity.getOriginal())) {
            final Metadata metadata = ImageMetadataReader.readMetadata(inputStream);
            final var exifIFDirectory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
            if (exifIFDirectory == null) {
                return 0;
            }
            return exifIFDirectory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
        } catch (IOException | ImageProcessingException | MetadataException e) {
            throw new RuntimeException(e);
        }
    }

    private BufferedImage fixOrientation(BufferedImage image, int orientation) {
        return switch (orientation) {
            case 1 -> image;
            case 2 -> Scalr.rotate(image, Scalr.Rotation.FLIP_HORZ);
            case 3 -> Scalr.rotate(image, Rotation.CW_180);
            case 4 -> Scalr.rotate(image, Rotation.FLIP_VERT);
            case 5 -> Scalr.rotate(Scalr.rotate(image, Rotation.CW_90), Rotation.FLIP_HORZ);
            case 6 -> Scalr.rotate(image, Rotation.CW_90);
            case 7 -> Scalr.rotate(Scalr.rotate(image, Rotation.CW_90), Rotation.FLIP_VERT);
            case 8 -> Scalr.rotate(image, Rotation.CW_270);
            default -> image;
        };
    }

    private BufferedImage buffered(Image image) {
        final BufferedImage bufferedImage = new BufferedImage(image.getWidth(null), image.getHeight(null), BufferedImage.TYPE_INT_RGB);
        bufferedImage.getGraphics().drawImage(image, 0, 0, null);
        return bufferedImage;
    }

    private byte[] getBytes(BufferedImage image) {
        try(final ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ImageIO.write(image, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
